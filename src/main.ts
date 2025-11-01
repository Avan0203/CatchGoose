/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:31:00
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 17:07:51
 * @FilePath: \catchBirld\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PhysicsBox, PhysicsCylinder, PhysicsTorus, PhysicsSphere } from './mesh';
import { game } from './scene/Game';
import { PhysicsSync } from './scene/PhysicsSync';
import { PhysicsBucket } from './mesh/PhysicsBucket';

const objectsList = [
  [PhysicsBox, {
    width: 1,
    height: 2,
    depth: 1,
    mass: 1,
  }],
  [PhysicsCylinder, {
    radiusTop: 1,
    radiusBottom: 2,
    height: 1,
    segments: 8,
    mass: 1,
  }],
  // [PhysicsTorus, {
  //   radius: 2,
  //   tube: 0.5,
  //   tubeSegments: 8,
  //   radialSegments: 8,
  //   mass: 1,
  // }],
  [PhysicsSphere, {
    radius: 1,
    segments: 16,
    mass: 1,
  }]];

// 等待游戏初始化完成后再执行 setup
(async () => {
  await game.setup(async function (physicsSync: PhysicsSync) {

    const toAdd: any[] = [];

    const bucketMesh = new PhysicsBucket({
      radius: 8,
      height: 20,
      segments: 32,
      mass: 0,
      position: { x: 0, y: 0, z: 0 },
    });
    toAdd.push(bucketMesh);

    const typeCount = objectsList.length;
    for (let index = 0; index < 200; index++) {
      const index = Math.floor(Math.random() * typeCount);
      const [className, params] = objectsList[index];
      if (typeof className === 'function') {
        const objectMesh = new className(params as any);
        toAdd.push(objectMesh);
      }
    }

    physicsSync.addObjectsGradually(toAdd, 20);


  });
})();



// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  game.destroy();
});
