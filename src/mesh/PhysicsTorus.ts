/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-28 16:57:30
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-28 17:05:50
 * @FilePath: \catchBirld\src\mesh\PhysicsTorus.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Mesh, MeshStandardMaterial, QuaternionLike, TorusGeometry, Vector3Like } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsTorus extends PhysicsMesh {
    constructor(data: { radius?: number, tube?: number, tubeSegments?: number, radialSegments?: number, mass?: number, position?: Vector3Like, quaternion?: QuaternionLike }) {
        super({
            type: 'torus',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    toMesh(): Mesh {
        const { radius, tube, tubeSegments, radialSegments } = this.data.params;
        const geometry = new TorusGeometry(radius, tube, tubeSegments, radialSegments);
        const material = new MeshStandardMaterial({ color: 0x345900 });
        return new Mesh(geometry, material);
    }

    toBody(): PhysicsMeshData {
        return this.data;
    }
}

export { PhysicsTorus };