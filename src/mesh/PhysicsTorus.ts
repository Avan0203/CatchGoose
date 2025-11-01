/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-28 16:57:30
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 17:24:38
 * @FilePath: \catchBirld\src\mesh\PhysicsTorus.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { TorusGeometry } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsTorusData = PhysicsData & {
    radius?: number;
    tube?: number;
    tubeSegments?: number;
    radialSegments?: number;
}

class PhysicsTorus extends PhysicsMesh {
    constructor(data: PhysicsTorusData) {
        super({
            type: 'torus',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    makeGeometry() {
        if (this.geometry) return this.geometry;
        const { radius, tube, tubeSegments, radialSegments } = this.data.params;
        const geometry = new TorusGeometry(radius, tube, tubeSegments, radialSegments);
        return geometry;
    }

}

export { PhysicsTorus, type PhysicsTorusData };