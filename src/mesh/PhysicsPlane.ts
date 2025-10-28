/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 16:58:08
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-28 16:01:46
 * @FilePath: \catchBirld\src\mesh\PhysicsPlane.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Mesh, MeshStandardMaterial, PlaneGeometry, QuaternionLike, Vector3Like } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsPlane extends PhysicsMesh {
    constructor(data: { width: number, height: number, mass: number, position?: Vector3Like, quaternion?: QuaternionLike }) {
        super({
            type: 'plane',
            params: data,
            mass: data.mass,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    toMesh(): Mesh {
        const { width, height } = this.data.params;
        const geometry = new PlaneGeometry(width, height);
        geometry.rotateX(-Math.PI / 2);
        const material = new MeshStandardMaterial({ color: 0xffff00, side: 2 });
        return new Mesh(geometry, material);
    }

    toBody(): PhysicsMeshData {
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

export { PhysicsPlane };