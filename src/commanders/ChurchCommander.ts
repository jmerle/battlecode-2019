import { SPECS } from 'battlecode';
import { Cell } from '../models/Cell';
import { ImprovedCommander } from './ImprovedCommander';

export class ChurchCommander extends ImprovedCommander {
  private needsWorker = true;
  private opponentCastle: Cell = null;

  protected getAction(): Action | Falsy {
    const type = this.getSpawnUnitType();
    const location = this.getSpawnLocation();

    if (this.unit === SPECS.CASTLE && this.globalFuel >= 2) {
      if (this.opponentCastle === null) {
        this.opponentCastle = this.detectOpponentCastle();
      }

      const castle = this.opponentCastle;
      this.signal(parseInt(`1${castle.x}${castle.y}`, 10), 2);

      this.globalFuel -= 2;
    }

    if (
      this.globalKarbonite >= SPECS.UNITS[type].CONSTRUCTION_KARBONITE &&
      this.globalFuel >= SPECS.UNITS[type].CONSTRUCTION_FUEL &&
      location !== null
    ) {
      this.needsWorker = false;

      const unit = this.unitTypeToString(type);
      this.log(`Spawning a ${unit} at (${location.x}, ${location.y})`);

      return this.buildUnitAt(location, type);
    }
  }

  private getSpawnUnitType(): number {
    if (this.turn < 150 && this.turn % 50 === 0) {
      this.needsWorker = true;
    }

    if (this.turn >= 150 && this.turn % 200 === 0) {
      this.needsWorker = true;
    }

    return this.needsWorker ? SPECS.PILGRIM : SPECS.PREACHER;
  }

  private getSpawnLocation(): Cell {
    const targets = this.cell.neighbors.filter(cell => cell.canMoveTo(false));
    return targets.length > 0 ? targets[0] : null;
  }

  private detectOpponentCastle(): Cell {
    let x = this.x;
    let y = this.y;

    if (this.isHorizontallySymmetric()) {
      const middle = Math.floor(this.height / 2);

      if (y <= middle) {
        y = middle + (middle - (y + 1)) + 1;

        if (this.height % 2 === 0) {
          y -= 1;
        }
      } else {
        y = middle - (y - middle) - 1;

        if (this.height % 2 !== 0) {
          y += 1;
        }
      }
    } else {
      const middle = Math.floor(this.width / 2);

      if (x <= middle) {
        x = middle + (middle - (x + 1)) + 1;

        if (this.width % 2 === 0) {
          x -= 1;
        }
      } else {
        x = middle - (x - middle) - 1;

        if (this.width % 2 !== 0) {
          x += 1;
        }
      }
    }

    return this.map[y][x];
  }

  private isHorizontallySymmetric(): boolean {
    for (let y = 0; y < Math.floor(this.height / 2); y++) {
      const rowUp = this.passableMap[y];
      const rowDown = this.passableMap[this.height - y - 1];

      for (let x = 0; x < this.width; x++) {
        if (rowUp[x] !== rowDown[x]) {
          return false;
        }
      }
    }

    return true;
  }
}
