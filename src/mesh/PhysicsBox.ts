import { BoxGeometry, Mesh, MeshStandardMaterial, QuaternionLike, Vector3Like } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsBox extends PhysicsMesh {
    constructor(data: { width?: number, height?: number, depth?: number, mass?: number, position?: Vector3Like, quaternion?: QuaternionLike }) {
        super({
            type: 'box',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    toMesh(): Mesh {
        const { width, height, depth } = this.data.params;
        const geometry = new BoxGeometry(width, height, depth);
        const material = new MeshStandardMaterial({ color: 0x0ff0f0 });
        return new Mesh(geometry, material);
    }

    toBody(): PhysicsMeshData {
        const { width, height, depth } = this.data.params;
        return Object.assign({}, this.data, { params: { width: width / 2, height: height / 2, depth: depth / 2 } });
    }
}

export { PhysicsBox };