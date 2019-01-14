import { SPECS } from 'battlecode';
import { Cell } from '../models/Cell';
import { Commander } from './Commander';

export abstract class ImprovedCommander extends Commander {
  protected karboniteCapacity: number;
  protected fuelCapacity: number;
  protected movementSpeed: number;
  protected movementCost: number;
  protected vision: number;
  protected attackDamage: number;
  protected attackRangeMin: number;
  protected attackRangeMax: number;
  protected attackCost: number;

  protected width: number;
  protected height: number;

  protected map: Cell[][];
  protected cells: Cell[];
  protected cell: Cell;

  protected passableMap: boolean[][];
  protected karboniteMap: boolean[][];
  protected fuelMap: boolean[][];
  protected robotMap: number[][];

  protected initTurn(): void {
    this.karboniteCapacity = SPECS.UNITS[this.unit].KARBONITE_CAPACITY;
    this.fuelCapacity = SPECS.UNITS[this.unit].FUEL_CAPACITY;
    this.movementSpeed = SPECS.UNITS[this.unit].SPEED;
    this.movementCost = SPECS.UNITS[this.unit].FUEL_PER_MOVE;
    this.vision = SPECS.UNITS[this.unit].VISION_RADIUS;
    this.attackDamage = SPECS.UNITS[this.unit].ATTACK_DAMAGE;
    this.attackCost = SPECS.UNITS[this.unit].ATTACK_FUEL_COST;

    if (SPECS.UNITS[this.unit].ATTACK_RADIUS) {
      this.attackRangeMin = SPECS.UNITS[this.unit].ATTACK_RADIUS[0];
      this.attackRangeMax = SPECS.UNITS[this.unit].ATTACK_RADIUS[1];
    }

    this.passableMap = this.getPassableMap();
    this.karboniteMap = this.getKarboniteMap();
    this.fuelMap = this.getFuelMap();
    this.robotMap = this.getVisibleRobotMap();

    this.width = this.passableMap[0].length;
    this.height = this.passableMap.length;

    this.createCells();
    this.fillNeighbors();
    this.createPaths();
  }

  protected moveToNearestTarget(targets: Cell[]): MoveAction | Falsy {
    if (targets.length === 0) {
      return;
    }

    targets.sort((a, b) => a.distance - b.distance);
    return this.moveTo(targets[0]);
  }

  protected moveTo(cell: Cell): MoveAction | Falsy {
    if (!cell.canMoveTo()) {
      return;
    }

    let current: Cell = cell;
    while (current !== null) {
      if (
        current.canMoveTo() &&
        this.cell.isInRange(current, this.movementSpeed) &&
        this.cell.costOfMove(current, this.movementCost) <= this.globalFuel
      ) {
        const [dx, dy] = this.cell.getDxDy(current);
        return this.move(dx, dy);
      }

      current = current.parent;
    }
  }

  protected buildUnitAt(cell: Cell, unit: number): BuildAction {
    const [dx, dy] = this.cell.getDxDy(cell);
    return this.buildUnit(unit, dx, dy);
  }

  protected giveTo(cell: Cell, karbonite: number, fuel: number): GiveAction {
    const [dx, dy] = this.cell.getDxDy(cell);
    return this.give(dx, dy, karbonite, fuel);
  }

  protected attackAt(cell: Cell): AttackAction {
    if (this.globalFuel >= this.attackCost) {
      const unit = this.unitTypeToString(cell.robot.unit);
      this.log(`Attacking a ${unit} at (${cell.x}, ${cell.y})`);

      const [dx, dy] = this.cell.getDxDy(cell);
      return this.attack(dx, dy);
    }
  }

  private createCells(): void {
    if (this.turn === 1) {
      this.map = [];
      this.cells = [];
    }

    for (let y = 0; y < this.height; y++) {
      if (this.turn === 1) {
        this.map[y] = [];
      }

      for (let x = 0; x < this.width; x++) {
        const cell = this.turn === 1 ? new Cell(x, y) : this.map[y][x];

        cell.hasKarbonite = this.karboniteMap[y][x];
        cell.hasFuel = this.fuelMap[y][x];

        cell.isPassable = this.passableMap[y][x];
        cell.robot =
          this.robotMap[y][x] > 0 ? this.getRobot(this.robotMap[y][x]) : null;

        cell.distance = -1;
        cell.parent = null;

        cell.neighbors = [];

        if (this.turn === 1) {
          this.map[y].push(cell);
          this.cells.push(cell);
        }
      }
    }

    this.cell = this.map[this.y][this.x];
  }

  private fillNeighbors(): void {
    const directions: Array<[number, number]> = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.map[y][x];

        for (const direction of directions) {
          const newX = x + direction[0];
          const newY = y + direction[1];

          if (this.isOnMap(newX, newY)) {
            cell.neighbors.push(this.map[newY][newX]);
          }
        }
      }
    }
  }

  private createPaths(): void {
    const queue: Cell[] = [];

    this.cell.distance = 0;
    queue.push(this.cell);

    while (queue.length > 0) {
      const cell = queue.shift();

      for (const neighbor of cell.neighbors) {
        if (neighbor.parent === null && neighbor.canMoveTo(false)) {
          neighbor.distance = cell.distance + 1;
          neighbor.parent = cell;

          queue.push(neighbor);
        }
      }
    }
  }
}
