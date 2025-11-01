export type EntityId = number;
export type Slot = number;

export type Vector3Scalar = { x: number; y: number; z: number };
export type QuaternionScalar = { x: number; y: number; z: number; w: number };

export type PhysicsCommon = {
  id: EntityId;
  slot: Slot;
  mass: number;
  position: Vector3Scalar;
  quaternion: QuaternionScalar;
};

export type BoxParams = { width: number; height: number; depth: number };
export type SphereParams = { radius: number; segments?: number };
export type PlaneParams = Record<string, never>;
export type CylinderParams = { radiusTop: number; radiusBottom: number; height: number; segments: number };
export type TorusParams = { radius: number; tube: number; tubeSegments: number; radialSegments: number };
export type BucketParams = { radius: number; height: number; segments: number };

export type PhysicsSpec =
  | (PhysicsCommon & { type: 'box'; params: BoxParams })
  | (PhysicsCommon & { type: 'sphere'; params: SphereParams })
  | (PhysicsCommon & { type: 'plane'; params: PlaneParams })
  | (PhysicsCommon & { type: 'cylinder'; params: CylinderParams })
  | (PhysicsCommon & { type: 'torus'; params: TorusParams })
  | (PhysicsCommon & { type: 'bucket'; params: BucketParams });

export type BatchAddMessage = { type: 'batchAdd'; payload: PhysicsSpec[] };
export type BatchRemoveItem = { id: EntityId; slot: Slot };
export type BatchRemoveMessage = { type: 'batchRemove'; payload: BatchRemoveItem[] };
export type InitBuffersMessage = {
  type: 'init';
  payload: {
    positions: Float32Array;
    quaternions: Float32Array;
    alive: Uint8Array;
  };
};


