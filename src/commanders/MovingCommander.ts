import { Commander } from './Commander';

export abstract class MovingCommander extends Commander {
  protected allDirections: Array<[number, number]> = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  protected moveRandomly(): MoveAction | Falsy {
    const directions = this.getAvailableDirections();

    if (directions.length > 0) {
      const [dx, dy] = directions[0];
      return this.move(dx, dy);
    }
  }

  protected getAvailableDirections(): Array<[number, number]> {
    return this.allDirections.filter(direction => {
      const [dx, dy] = direction;
      return this.canMoveTo(this.x + dx, this.y + dy);
    });
  }

  protected canMoveTo(x: number, y: number): boolean {
    return (
      this.isOnMap(x, y) &&
      this.getPassableMap()[y][x] &&
      this.getVisibleRobotMap()[y][x] === 0
    );
  }
}
