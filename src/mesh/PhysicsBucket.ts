/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-31 15:05:02
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-11-01 17:33:12
 * @FilePath: \catchBirld\src\mesh\PhysicsBucket.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Box3, BufferGeometry, Vector3 } from "three";
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
        this.aabb = new Box3(new Vector3(-data.radius, 0, -data.radius), new Vector3(data.radius, data.height, data.radius));
    }

    makeGeometry() {
        //不用绘制绘制，只是以为边界做限制
        return new BufferGeometry();
    }
}

export { PhysicsBucket, type PhysicsBucketData };