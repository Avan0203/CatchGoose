/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 11:33:04
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-27 16:38:19
 * @FilePath: \catchBirld\src\scene\PhysicsMesh.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Mesh, Vector3Like, QuaternionLike } from 'three';

type PhysicsMeshData = {
    type: string;
    params: any;
    mass: number;
    position?: Vector3Like;
    quaternion?: QuaternionLike;
};

abstract class PhysicsMesh {
    data: PhysicsMeshData;
    constructor(data: PhysicsMeshData) {
        this.data = data;
    }

    abstract toMesh(): Mesh;
    abstract toBody(): PhysicsMeshData;
}

export { PhysicsMesh, type PhysicsMeshData };