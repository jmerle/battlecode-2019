import { SPECS } from 'battlecode';

export class Cell {
  public x: number;
  public y: number;

  public hasKarbonite: boolean;
  public hasFuel: boolean;

  public isPassable: boolean;
  public robot: Robot | null;

  public distance: number;
  public parent: Cell | null;

  public neighbors: Cell[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public canMoveTo(checkDistance: boolean = false): boolean {
    if (checkDistance && this.distance < 0) {
      return false;
    }

    return this.isPassable && this.robot === null;
  }

  public getDxDy(other: Cell): [number, number] {
    return [other.x - this.x, other.y - this.y];
  }

  public costOfMove(other: Cell, movementCost: number): number {
    const [dx, dy] = this.getDxDy(other);
    return (dx * dx + dy * dy) * movementCost;
  }

  public isInRange(other: Cell, range: number): boolean {
    const [dx, dy] = this.getDxDy(other);
    return dx * dx + dy * dy <= range;
  }

  public getCellsInRange(range: number): Cell[] {
    const cells: Set<Cell> = new Set();

    const queue: Cell[] = [...this.neighbors];

    while (queue.length > 0) {
      const cell = queue.shift();

      if (this.isInRange(cell, range)) {
        if (!cells.has(cell)) {
          cells.add(cell);

          queue.push(...cell.neighbors);
        }
      }
    }

    return [...cells];
  }

  public hasBuilding(): boolean {
    if (this.robot === null) {
      return false;
    }

    const u = this.robot.unit;
    return u === SPECS.CASTLE || u === SPECS.CHURCH;
  }

  public hasWorker(): boolean {
    return this.robot !== null && this.robot.unit === SPECS.PILGRIM;
  }

  public hasAttacker(): boolean {
    if (this.robot === null) {
      return false;
    }

    const u = this.robot.unit;
    return u === SPECS.CRUSADER || u === SPECS.PROPHET || u === SPECS.PREACHER;
  }
}
