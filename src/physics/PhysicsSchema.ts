import { PhysicsMeshData } from '../scene/PhysicsMesh';
import { PhysicsSpec, EntityId, Slot } from './Types';

export class PhysicsSchema {
  static fromMeshData(id: EntityId, slot: Slot, data: PhysicsMeshData): PhysicsSpec {
    const base = {
      id,
      slot,
      mass: data.mass,
      position: data.position ?? { x: 0, y: 0, z: 0 },
      quaternion: data.quaternion ?? { x: 0, y: 0, z: 0, w: 1 },
    } as const;

    switch (data.type) {
      case 'box': {
        // cannon-es Box takes half-extents
        const { width, height, depth } = data.params;
        return { ...base, type: 'box', params: { width: width / 2, height: height / 2, depth: depth / 2 } };
      }
      case 'sphere':
        return { ...base, type: 'sphere', params: { radius: data.params.radius, segments: data.params.segments } };
      case 'plane':
        return { ...base, type: 'plane', params: {} } as PhysicsSpec;
      case 'cylinder': {
        const { radiusTop, radiusBottom, height, segments } = data.params;
        return { ...base, type: 'cylinder', params: { radiusTop, radiusBottom, height, segments } };
      }
      case 'torus': {
        const { radius, tube, tubeSegments, radialSegments } = data.params;
        return { ...base, type: 'torus', params: { radius, tube, tubeSegments, radialSegments } };
      }
      case 'bucket': {
        const { radius, height, segments } = data.params;
        return { ...base, type: 'bucket', params: { radius, height, segments } };
      }
      default:
        throw new Error(`Unsupported physics type: ${data.type}`);
    }
  }
}


