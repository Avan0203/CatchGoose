/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:30:30
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 14:24:18
 * @FilePath: \catchBirld\src\workers\physicsWorker.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { World, Body } from 'cannon-es';
import { PhysicsMeshData } from '../scene/PhysicsMesh';
import { PhysicsSpec, BatchRemoveItem } from '../physics/Types';
import { Params2Body } from '../utils/params2Body';

let world: World;
const step = 1 / 60;
const interval = step * 1000;
// slot-indexed bodies
const bodies: Array<Body | undefined> = [];

let positions!: Float32Array;
let quaternions!: Float32Array;
let alive!: Uint8Array;

// 处理消息
self.onmessage = function (event: MessageEvent<{ type: keyof typeof eventHandler; payload: any }>) {
  const { type, payload } = event.data;
  console.log(`[main]--${type}-->[worker]`);
  eventHandler[type](payload);
};


const eventHandler = {
  init(data: { positions: Float32Array; quaternions: Float32Array; alive: Uint8Array }) {
    positions = data.positions;
    quaternions = data.quaternions;
    alive = data.alive;
    world = new World();
    world.gravity.set(0, -10, 0);

    self.postMessage({ type: 'init' });

    setInterval(eventHandler.update, interval);
    console.log('[worker]-->物理世界初始化完成');
  },
  batchAdd(specs: PhysicsSpec[]) {
    for (const spec of specs) {
      const body = Params2Body.toBody({
        type: spec.type,
        params: spec.params as any,
        mass: spec.mass,
        position: spec.position,
        quaternion: spec.quaternion,
      } as PhysicsMeshData);
      bodies[spec.slot] = body;
      world.addBody(body);
      alive[spec.slot] = 1;
    }
  },
  batchRemove(items: BatchRemoveItem[]) {
    for (const { slot } of items) {
      const body = bodies[slot];
      if (body) {
        world.removeBody(body);
        bodies[slot] = undefined;
        alive[slot] = 0;
      }
    }
  },
  update() {
    world.fixedStep(step);
    // iterate all slots; alive marks active
    for (let slot = 0; slot < alive.length; slot++) {
      if (alive[slot] !== 1) continue;
      const body = bodies[slot];
      if (!body) continue;
      const j = slot * 3;
      const k = slot * 4;
      positions[j] = body.position.x;
      positions[j + 1] = body.position.y;
      positions[j + 2] = body.position.z;
      quaternions[k] = body.quaternion.x;
      quaternions[k + 1] = body.quaternion.y;
      quaternions[k + 2] = body.quaternion.z;
      quaternions[k + 3] = body.quaternion.w;
    }
  }
};