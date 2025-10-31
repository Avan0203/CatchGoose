/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 11:33:04
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-31 15:34:34
 * @FilePath: \catchBirld\src\scene\PhysicsMesh.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body } from 'cannon-es';
import { Vector3Like, QuaternionLike, BufferGeometry, MeshPhongMaterial, Mesh } from 'three';
import { Params2Body } from '../utils/params2Body';

const defaultMaterial = new MeshPhongMaterial({
    color: 0x0fffff
})

type PhysicsData = {
    mass: number;
    position?: Vector3Like;
    quaternion?: QuaternionLike;
}

type PhysicsMeshData = PhysicsData & {
    type: string;
    params: any;
};

abstract class PhysicsMesh {
    data: PhysicsMeshData;
    constructor(data: PhysicsMeshData) {
        this.data = data;
    }

    abstract makeGeometry(): BufferGeometry;
    abstract makeBody(): PhysicsMeshData;

    static toMesh(geometry: BufferGeometry, material = defaultMaterial): Mesh {
        return new Mesh(geometry, material);
    }

    static toBody(params: PhysicsMeshData): Body {
        return Params2Body.toBody(params)
    }

}

export { PhysicsMesh, type PhysicsMeshData, type PhysicsData };