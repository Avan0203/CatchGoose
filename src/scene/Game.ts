/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 11:42:55
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 17:10:33
 * @FilePath: \catchBirld\src\scene\Game.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SceneManager } from './SceneManager';
import { PhysicsSync } from './PhysicsSync';

class Game {
    private container: HTMLElement;
    private sceneManager!: SceneManager;
    private physicsSync!: PhysicsSync;
    private animationId!: number;
    constructor() {
        this.container = document.getElementById('app')!;
        this.init();
    }

    async init() {
        // 创建场景管理器
        this.sceneManager = new SceneManager(this.container);

        // 创建物理同步管理器
        this.physicsSync = new PhysicsSync(this.sceneManager);

        // 等待物理世界初始化完成
        await this.physicsSync.waitForInit();

        // 设置窗口大小变化监听
        window.addEventListener('resize', () => {
            this.sceneManager.onWindowResize();
        });

        // 开始动画循环
        this.animate();
    }

    async setup(callback: (physicsSync: PhysicsSync) => void | Promise<void>) {
        // 确保 PhysicsSync 已初始化
        await this.physicsSync.waitForInit();
        await callback(this.physicsSync);
    }


    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // 更新场景管理器
        this.sceneManager.update();

        // 更新物理同步
        this.physicsSync.updateObjects();

        // 更新调试器
        this.physicsSync.updateDebugger();

        // 渲染场景
        this.sceneManager.render();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.physicsSync) {
            this.physicsSync.destroy();
        }

        window.removeEventListener('resize', this.sceneManager.onWindowResize);
    }
}

// 启动游戏
const game = new Game();

export { game };