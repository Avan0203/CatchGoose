/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:30:56
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 14:08:39
 * @FilePath: \catchBirld\src\scene\PhysicsSync.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Mesh } from "three";
import { PhysicsMesh, PhysicsMeshData } from "./PhysicsMesh";
import { SceneManager } from "./SceneManager";
import { World } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { MemoryLayout } from "../physics/MemoryLayout";
import { SlotAllocator } from "../physics/SlotAllocator";
import { PhysicsSchema } from "../physics/PhysicsSchema";
import { EntityId, PhysicsSpec } from "../physics/Types";

const maxMeshCount = 500;

export class PhysicsSync {
  sceneManager: SceneManager;
  worker!: Worker;
  debugger: any | null;
  // registries
  idToMesh: Map<EntityId, Mesh>;
  meshToId: WeakMap<Mesh, EntityId>;
  idToSlot: Map<EntityId, number>;
  aliveIds: Set<EntityId>;
  isReady: boolean;
  eventHandlers: Record<string, (payload: any) => any>;
  positionBuffer: Float32Array;
  quaternionBuffer: Float32Array;
  aliveBuffer: Uint8Array;
  private initPromise: Promise<void>;
  private initResolve!: () => void;
  debuggerWorld!: World;
  private memory: MemoryLayout;
  private allocator: SlotAllocator;
  private nextEntityId: number;
  private pendingAddQueue: PhysicsMesh[];
  private addChunkSize: number;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    this.idToMesh = new Map();
    this.meshToId = new WeakMap();
    this.idToSlot = new Map();
    this.aliveIds = new Set();
    this.isReady = false;
    this.nextEntityId = 1;
    this.pendingAddQueue = [];
    this.addChunkSize = 0;

    // 创建初始化 Promise
    this.initPromise = new Promise<void>((resolve) => {
      this.initResolve = resolve;
    });

    this.eventHandlers = {
      init: () => {
        this.isReady = true;
        console.log('[main]--物理世界初始化完成');
        this.initResolve();
      }
    };

    this.memory = new MemoryLayout(maxMeshCount);
    const views = this.memory.getViews();
    this.positionBuffer = views.positions;
    this.quaternionBuffer = views.quaternions;
    this.aliveBuffer = views.alive;
    this.allocator = new SlotAllocator(maxMeshCount);

    this.initWorker();
  }

  // 等待初始化完成的方法
  async waitForInit(): Promise<void> {
    return this.initPromise;
  }

  initWorker() {
    // 创建 Worker
    this.worker = new Worker(
      new URL('../workers/physicsWorker.ts', import.meta.url),
      { type: 'module' }
    );
    console.log('worker 创建完成');

    // 监听 Worker 消息
    this.worker.onmessage = (event) => {
      const { type, payload } = event.data;
      // Avoid logging large payloads per frame; only log type
      console.log(`[worker]--${type}-->[main]`);
      this.eventHandlers[type]?.call(this, payload);
    };

    // 初始化物理世界
    this.worker.postMessage({
      type: 'init',
      payload: {
        positions: this.positionBuffer,
        quaternions: this.quaternionBuffer,
        alive: this.aliveBuffer,
      }
    });

    this.debuggerWorld = new World();
    this.debugger = CannonDebugger(this.sceneManager.getScene(), this.debuggerWorld, { color: 0xfff });
    this.debuggerWorld.gravity.set(0, -10, 0);
  }

  addObjects(objects: PhysicsMesh[]) {
    const specs: PhysicsSpec[] = [];
    for (const object of objects) {
      const id = this.nextEntityId++ as EntityId;
      const slot = this.allocator.alloc();

      const geometry = object.makeGeometry();
      const mesh = PhysicsMesh.toMesh(geometry);
      this.sceneManager.addObject(mesh);

      this.idToMesh.set(id, mesh);
      this.meshToId.set(mesh, id);
      this.idToSlot.set(id, slot);
      this.aliveIds.add(id);
      this.aliveBuffer[slot] = 1;

      const spec = PhysicsSchema.fromMeshData(id, slot, (object as any).data as PhysicsMeshData);
      specs.push(spec);

      // debugger mirror body
      const dbgBodyData: PhysicsMeshData = {
        type: spec.type,
        params: spec.params as any,
        mass: spec.mass,
        position: spec.position,
        quaternion: spec.quaternion,
      };
      this.debuggerWorld.addBody(PhysicsMesh.toBody(dbgBodyData));
    }

    if (specs.length > 0) {
      this.worker.postMessage({ type: 'batchAdd', payload: specs });
    }
  }

  addObjectsGradually(objects: PhysicsMesh[], chunkSize = 20) {
    this.pendingAddQueue.push(...objects);
    this.addChunkSize = Math.max(1, chunkSize | 0);
  }

  removeByMeshes(meshes: Mesh[]) {
    const items: { id: EntityId; slot: number }[] = [];
    for (const mesh of meshes) {
      const id = this.meshToId.get(mesh);
      if (id == null) continue;
      const slot = this.idToSlot.get(id);
      if (slot == null) continue;
      items.push({ id, slot });

      // local cleanup
      this.sceneManager.removeObject(mesh);
      this.idToMesh.delete(id);
      this.meshToId.delete(mesh);
      this.idToSlot.delete(id);
      this.aliveIds.delete(id);
      this.aliveBuffer[slot] = 0;
      this.allocator.free(slot);
    }
    if (items.length > 0) {
      this.worker.postMessage({ type: 'batchRemove', payload: items });
    }
  }

  updateObjects() {
    if (!this.isReady) return;
    // process a chunk of pending additions per frame
    if (this.pendingAddQueue.length > 0 && this.addChunkSize > 0) {
      const count = Math.min(this.addChunkSize, this.pendingAddQueue.length);
      const batch: PhysicsSpec[] = [];
      for (let i = 0; i < count; i++) {
        const object = this.pendingAddQueue.shift() as PhysicsMesh;
        const id = this.nextEntityId++ as EntityId;
        const slot = this.allocator.alloc();

        const geometry = object.makeGeometry();
        const mesh = PhysicsMesh.toMesh(geometry);
        this.sceneManager.addObject(mesh);

        this.idToMesh.set(id, mesh);
        this.meshToId.set(mesh, id);
        this.idToSlot.set(id, slot);
        this.aliveIds.add(id);
        this.aliveBuffer[slot] = 1;

        const spec = PhysicsSchema.fromMeshData(id, slot, (object as any).data as PhysicsMeshData);
        batch.push(spec);

        const dbgBodyData: PhysicsMeshData = {
          type: spec.type,
          params: spec.params as any,
          mass: spec.mass,
          position: spec.position,
          quaternion: spec.quaternion,
        };
        this.debuggerWorld.addBody(PhysicsMesh.toBody(dbgBodyData));
      }
      if (batch.length > 0) {
        this.worker.postMessage({ type: 'batchAdd', payload: batch });
      }
    }
    for (const [id, slot] of this.idToSlot) {
      if (this.aliveBuffer[slot] !== 1) continue;
      const mesh = this.idToMesh.get(id);
      if (!mesh) continue;
      const j = slot * 3;
      const k = slot * 4;
      mesh.position.set(this.positionBuffer[j], this.positionBuffer[j + 1], this.positionBuffer[j + 2]);
      mesh.quaternion.set(this.quaternionBuffer[k], this.quaternionBuffer[k + 1], this.quaternionBuffer[k + 2], this.quaternionBuffer[k + 3]);
    }
  }

  updateDebugger() {
    this.debuggerWorld.fixedStep(1/60);
    this.debugger.update();
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null as unknown as Worker;
    }
    this.isReady = false;
  }
}
