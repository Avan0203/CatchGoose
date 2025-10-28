import { Mesh, MeshStandardMaterial, QuaternionLike, SphereGeometry, Vector3Like } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsSphere extends PhysicsMesh {
    constructor(data: { radius: number, segments: number ,mass: number, position?: Vector3Like, quaternion?: QuaternionLike}) {
        super({
            type: 'sphere',
            params: data,
            mass: data.mass,
            position: data.position || {x: 0, y: 0, z: 0},
            quaternion: data.quaternion || {x: 0, y: 0, z: 0, w: 1},
        });
    }

    toMesh(): Mesh {
        const { radius, segments } = this.data.params;
        const geometry = new SphereGeometry(radius, segments, segments);
        const material = new MeshStandardMaterial({ color: 0x00ff00 });
        return new Mesh(geometry, material);
    }

    toBody(): PhysicsMeshData {
        return this.data;
    }
}

export { PhysicsSphere };