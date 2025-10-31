import { BoxGeometry } from "three";
import { PhysicsData, PhysicsMesh } from "../scene/PhysicsMesh";

type PhysicsBoxData = PhysicsData & {
    width?: number;
    height?: number;
    depth?: number;
}

class PhysicsBox extends PhysicsMesh {
    constructor(data: PhysicsBoxData) {
        super({
            type: 'box',
            params: data,
            mass: data.mass || 1,
            position: data.position || { x: 0, y: 0, z: 0 },
            quaternion: data.quaternion || { x: 0, y: 0, z: 0, w: 1 },
        });
    }

    makeGeometry() {
        const { width, height, depth } = this.data.params;
        return new BoxGeometry(width, height, depth);
    }

    makeBody() {
        const { width, height, depth } = this.data.params;
        return Object.assign({}, this.data, { params: { width: width / 2, height: height / 2, depth: depth / 2 } });
    }
}

export { PhysicsBox, type PhysicsBoxData };