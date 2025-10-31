/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 11:40:22
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 15:31:31
 * @FilePath: \catchBirld\src\mesh\PhysicsSphere.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SphereGeometry } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsSphereData = PhysicsData & {
    radius: number;
    segments: number;
}

class PhysicsSphere extends PhysicsMesh {
    constructor(data: PhysicsSphereData) {
        super({
            type: 'sphere',
            params: data,
            mass: data.mass,
            position: data.position || {x: 0, y: 0, z: 0},
            quaternion: data.quaternion || {x: 0, y: 0, z: 0, w: 1},
        });
    }

    makeGeometry() {
        const { radius, segments } = this.data.params;
        const geometry = new SphereGeometry(radius, segments, segments);
        return geometry;
    }

    makeBody() {
        return this.data;
    }
}

export { PhysicsSphere, type PhysicsSphereData };