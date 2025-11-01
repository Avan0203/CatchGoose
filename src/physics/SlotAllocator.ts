export class SlotAllocator {
  private capacity: number;
  private freeList: number[];
  private next: number;

  constructor(initialCapacity: number) {
    this.capacity = initialCapacity;
    this.freeList = [];
    this.next = 0;
  }

  getCapacity(): number {
    return this.capacity;
  }

  alloc(): number {
    if (this.freeList.length > 0) {
      return this.freeList.pop() as number;
    }
    if (this.next < this.capacity) {
      const slot = this.next;
      this.next += 1;
      return slot;
    }
    throw new Error('SlotAllocator: capacity exhausted');
  }

  free(slot: number): void {
    this.freeList.push(slot);
  }
}


