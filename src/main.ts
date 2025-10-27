/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:31:00
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-27 17:29:29
 * @FilePath: \catchBirld\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PhysicsSphere } from './mesh';
import { PhysicsPlane } from './mesh/PhysicsPlane';
import { game } from './scene/Game';
import { PhysicsSync } from './scene/PhysicsSync';

// 等待游戏初始化完成后再执行 setup
(async () => {
  await game.setup(async function (physicsSync: PhysicsSync) {
    const ground = new PhysicsPlane({
      width: 20,
      height: 20,
      mass: 0,
      position: { x: 0, y: -10, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
    });
    physicsSync.addObject(ground);

    const sphereMesh = new PhysicsSphere({ radius: 1, segments: 32, mass: 1 });
    physicsSync.addObject(sphereMesh);
  });
})();

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  game.destroy();
});
