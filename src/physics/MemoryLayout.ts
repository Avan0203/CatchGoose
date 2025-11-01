export type MemoryViews = {
  positions: Float32Array;
  quaternions: Float32Array;
  alive: Uint8Array;
};

export class MemoryLayout {
  private capacity: number;
  private buffers: {
    positions: SharedArrayBuffer;
    quaternions: SharedArrayBuffer;
    alive: SharedArrayBuffer;
  };
  private views: MemoryViews;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffers = {
      positions: new SharedArrayBuffer(capacity * 3 * Float32Array.BYTES_PER_ELEMENT),
      quaternions: new SharedArrayBuffer(capacity * 4 * Float32Array.BYTES_PER_ELEMENT),
      alive: new SharedArrayBuffer(capacity * Uint8Array.BYTES_PER_ELEMENT),
    };
    this.views = {
      positions: new Float32Array(this.buffers.positions),
      quaternions: new Float32Array(this.buffers.quaternions),
      alive: new Uint8Array(this.buffers.alive),
    };
  }

  getCapacity(): number { return this.capacity; }
  getBuffers() { return this.buffers; }
  getViews(): MemoryViews { return this.views; }
}


