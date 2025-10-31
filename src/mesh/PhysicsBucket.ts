/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-31 15:05:02
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 17:41:24
 * @FilePath: \catchBirld\src\mesh\PhysicsBucket.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BufferGeometry, CylinderGeometry } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsBucketData = PhysicsData & {
    radius: number;
    height: number;
    segments: number;
}

class PhysicsBucket extends PhysicsMesh {
    constructor(data: PhysicsBucketData) {
        super({
            type: 'bucket',
            params: data,
            mass: data.mass ?? 1,
            position: data.position ?? { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion ?? { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    makeGeometry() {
        return new BufferGeometry();
        return new CylinderGeometry(this.data.params.radius, this.data.params.radius, this.data.params.height, this.data.params.segments);
    }

    makeBody() {
        return {
            type: 'bucket',
            params: this.data.params,
            mass: this.data.mass,
            position: this.data.position,
            quaternion: this.data.quaternion,
        };
    }
}

export { PhysicsBucket, type PhysicsBucketData };