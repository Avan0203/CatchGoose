/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:31:00
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 17:43:51
 * @FilePath: \catchBirld\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Euler, Quaternion } from 'three';
import { PhysicsPlane, PhysicsBox, PhysicsCylinder, PhysicsTorus, PhysicsSphere } from './mesh';
import { game } from './scene/Game';
import { PhysicsSync } from './scene/PhysicsSync';
import { PhysicsBucket } from './mesh/PhysicsBucket';

// 等待游戏初始化完成后再执行 setup
(async () => {
  await game.setup(async function (physicsSync: PhysicsSync) {
    const q = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0));
    // const ground = new PhysicsPlane({
    //   width: 10,
    //   height: 20,
    //   mass: 0,
    //   position: { x: 0, y: 0, z: 0 },
    //   quaternion: { x: q.x, y: q.y, z: q.z, w: q.w },
    // });
    // physicsSync.addObject(ground);

    const bucketMesh = new PhysicsBucket({
      radius: 5,
      height: 20,
      segments: 32,
      mass: 0,
      position: { x: 0, y: 0, z: 0 },
    });
    physicsSync.addObject(bucketMesh);

    const cylinderMesh = new PhysicsCylinder({
      radiusTop: 1,
      radiusBottom: 2,
      height: 1,
      segments: 32,
      mass: 0,
      position: { x: 0, y: 5, z: 0 },
    });
    physicsSync.addObject(cylinderMesh);

    const torusMesh = new PhysicsTorus({
      radius: 2,
      tube: 0.5,
      tubeSegments: 16,
      radialSegments: 16,
      mass: 2,
      position: { x: 0, y: 5, z: 0 },
    });
    physicsSync.addObject(torusMesh);

    for (let index = 0; index < 20; index++) {
      const sphereMesh = new PhysicsSphere({
        radius: 1, segments: 16, mass: 1,
        position: { x: 0, y: 10, z: 0, }
      });
      physicsSync.addObject(sphereMesh);

    }



    const boxMesh = new PhysicsBox({
      width: 1, height: 2, depth: 1, mass: 1,
      position: { x: 2, y: 5, z: 0 },
    });
    physicsSync.addObject(boxMesh);


  });
})();

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  game.destroy();
});
