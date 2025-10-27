import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import { PhysicsMesh, PhysicsMeshData } from "../scene/PhysicsMesh";


class PhysicsSphere extends PhysicsMesh {
    constructor(data: { radius: number, segments: number ,mass: number}) {
        super({
            type: 'sphere',
            params: data,
            mass: data.mass,
            position: {x: 0, y: 0, z: 0},
            quaternion: {x: 0, y: 0, z: 0, w: 1},
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