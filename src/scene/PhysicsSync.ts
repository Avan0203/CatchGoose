/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:30:56
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 17:30:59
 * @FilePath: \catchBirld\src\scene\PhysicsSync.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Mesh } from "three";
import { PhysicsMesh } from "./PhysicsMesh";
import { SceneManager } from "./SceneManager";
import { World } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Params2Body } from "../utils/params2Body";

const maxMeshCount = 500;

const positionBuffer = new SharedArrayBuffer(maxMeshCount * 3 * Float32Array.BYTES_PER_ELEMENT);
const quaternionBuffer = new SharedArrayBuffer(maxMeshCount * 4 * Float32Array.BYTES_PER_ELEMENT);

export class PhysicsSync {
  sceneManager: SceneManager;
  worker!: Worker;
  debugger: any | null;
  meshes: Mesh[];
  isReady: boolean;
  eventHandlers: Record<string, (payload: any) => any>;
  positionBuffer: Float32Array<SharedArrayBuffer>;
  quaternionBuffer: Float32Array<SharedArrayBuffer>;
  private initPromise: Promise<void>;
  private initResolve!: () => void;
  debuggerWorld!: World;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    this.meshes = []; // 延迟获取
    this.isReady = false;

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

    this.positionBuffer = new Float32Array(positionBuffer);
    this.quaternionBuffer = new Float32Array(quaternionBuffer);

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
      console.log(`[worker]--${type}-->[main], payload:`, payload);
      this.eventHandlers[type]?.call(this, payload);
    };

    // 初始化物理世界
    this.worker.postMessage({
      type: 'init',
      payload: {
        positionBuffer: this.positionBuffer,
        quaternionBuffer: this.quaternionBuffer
      }
    });

    this.debuggerWorld = new World();
    this.debugger = CannonDebugger(this.sceneManager.getScene(), this.debuggerWorld, { color: 0xfff });
    this.debuggerWorld.gravity.set(0, -10, 0);


  }

  addObject(object: PhysicsMesh) {
    const geometry = object.makeGeometry();
    const mesh = PhysicsMesh.toMesh(geometry);
    this.meshes.push(mesh);
    this.sceneManager.addObject(mesh);
    this.worker.postMessage({ type: 'add', payload: object.makeBody() });

    this.debuggerWorld.addBody(PhysicsMesh.toBody(object.makeBody()));
  }

  updateObjects() {
    if (!this.isReady || !this.meshes) return;
    for (let i = 0, j = 0, k = 0, l = this.meshes.length; i < l; i++, j = i * 3, k = i * 4) {
      const mesh = this.meshes[i];

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
