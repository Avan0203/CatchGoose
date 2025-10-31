/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 16:58:08
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 16:10:12
 * @FilePath: \catchBirld\src\mesh\PhysicsPlane.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PlaneGeometry, Quaternion } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsPlaneData = PhysicsData & {
    width: number;
    height: number;
}

class PhysicsPlane extends PhysicsMesh {
    constructor(data: PhysicsPlaneData) {
        super({
            type: 'plane',
            params: data,
            mass: data.mass,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    makeGeometry() {
        const { width, height } = this.data.params;
        const geometry = new PlaneGeometry(width, height);
        return geometry;
    }

    makeBody() {
        const { width, height, mass, position, quaternion } = this.data.params;
        return {
            type: 'plane',
            params: { width: width / 2, height: height / 2 },
            mass: mass,
            position: position || { x: 0, y: 0, z: 0 },
            quaternion: quaternion || { x: 0, y: 0, z: 0, w: 1 },
        };
    }
}

export { PhysicsPlane, type PhysicsPlaneData };