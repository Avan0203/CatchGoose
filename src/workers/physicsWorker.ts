/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:30:30
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-27 17:41:44
 * @FilePath: \catchBirld\src\workers\physicsWorker.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  World,
  Body
} from 'cannon-es';
import { PhysicsMeshData } from '../scene/PhysicsMesh';
import { Params2Body } from '../utils/params2Body';

let world: World;
const step = 1 / 60;
const interval = step * 1000;
const bodies: Body[] = [];

let positionBuffer!: Float32Array;
let quaternionBuffer!: Float32Array;

// 处理消息
self.onmessage = function (event: MessageEvent<{ type: keyof typeof eventHandler; payload: any }>) {
  const { type, payload } = event.data;
  console.log(`[main]--${type}-->[worker], payload:`, payload);
  eventHandler[type](payload);
};


const eventHandler = {
  init(data: { positionBuffer: Float32Array, quaternionBuffer: Float32Array }) {
    positionBuffer = data.positionBuffer;
    quaternionBuffer = data.quaternionBuffer;
    world = new World();
    world.gravity.set(0, -10, 0);

    self.postMessage({ type: 'init' });

    setInterval(eventHandler.update, interval);
    console.log('[worker]-->物理世界初始化完成');
  },
  add(params: PhysicsMeshData) {
    const body = Params2Body.toBody(params);
    bodies.push(body);
    world.addBody(body);
  },
  remove(body: Body) {
    world.removeBody(body);
  },
  update() {
    world.fixedStep(step);
    for (let i = 0, j = 0, k = 0, l = bodies.length; i < l; i++, j = i * 3, k = i * 4) {
      const body = bodies[i];
      positionBuffer[j] = body.position.x;
      positionBuffer[j + 1] = body.position.y;
      positionBuffer[j + 2] = body.position.z;
      quaternionBuffer[k] = body.quaternion.x;
      quaternionBuffer[k + 1] = body.quaternion.y;
      quaternionBuffer[k + 2] = body.quaternion.z;
      quaternionBuffer[k + 3] = body.quaternion.w;
    }
  }
};