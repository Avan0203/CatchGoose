/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-28 16:11:38
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-28 16:36:39
 * @FilePath: \catchBirld\src\mesh\PhysicsCylinder.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CylinderGeometry, Mesh, MeshStandardMaterial, QuaternionLike, Vector3Like } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsCylinder extends PhysicsMesh {
    constructor(data: { radiusTop?: number, radiusBottom?: number, height?: number, segments?: number, mass?: number, position?: Vector3Like, quaternion?: QuaternionLike }) {
        super({
            type: 'cylinder',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    toMesh(): Mesh {
        const { radiusTop, radiusBottom, height, segments } = this.data.params;
        const geometry = new CylinderGeometry(radiusTop, radiusBottom, height, segments, segments, true);
        const material = new MeshStandardMaterial({ color: 0xff9900 });
        return new Mesh(geometry, material);
    }

    toBody(): PhysicsMeshData {
        return this.data;
    }
}

export { PhysicsCylinder };