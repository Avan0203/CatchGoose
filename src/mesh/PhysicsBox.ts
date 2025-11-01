/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-28 16:42:48
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 17:23:53
 * @FilePath: \catchBirld\src\mesh\PhysicsBox.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BoxGeometry } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsBoxData = PhysicsData & {
    width?: number;
    height?: number;
    depth?: number;
}

class PhysicsBox extends PhysicsMesh {
    constructor(data: PhysicsBoxData) {
        super({
            type: 'box',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    makeGeometry() {
        if (this.geometry) return this.geometry;
        const { width, height, depth } = this.data.params;
        return new BoxGeometry(width, height, depth);
    }
}

export { PhysicsBox, type PhysicsBoxData };