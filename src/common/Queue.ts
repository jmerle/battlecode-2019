export class Queue<T> {
  private items: T[] = [];

  private capacity: number;
  private length = 0;
  private front = 0;

  constructor(capacity: number) {
    this.capacity = this.pow2AtLeast(capacity);
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public push(item: T): void {
    const length = this.length;
    this.checkCapacity(length + 1);
    const i = (this.front + length) & (this.capacity - 1);
    this.items[i] = item;
    this.length = length + 1;
  }

  public shift(): T {
    const length = this.length;
    const front = this.front;

    const result = this.items[front];

    this.items[front] = null;
    this.front = (front + 1) & (this.capacity - 1);
    this.length = length - 1;

    return result;
  }

  private checkCapacity(size: number): void {
    if (this.capacity < size) {
      this.resizeTo(this.pow2AtLeast(size));
    }
  }

  private resizeTo(amount: number): void {
    const oldCapacity = this.capacity;
    this.capacity = amount;

    const front = this.front;
    const length = this.length;

    if (front + length > oldCapacity) {
      const moveItemsCount = (front + length) & (oldCapacity - 1);

      for (let i = 0; i < moveItemsCount; i++) {
        this.items[i + oldCapacity] = this.items[i];
        this.items[i] = null;
      }
    }
  }

  private pow2AtLeast(n: number): number {
    n = n >>> 0;
    n = n - 1;
    n = n | (n >> 1);
    n = n | (n >> 2);
    n = n | (n >> 4);
    n = n | (n >> 8);
    n = n | (n >> 16);
    return n + 1;
  }
}
