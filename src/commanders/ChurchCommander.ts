import { SPECS } from 'battlecode';
import { Cell } from '../models/Cell';
import { ImprovedCommander } from './ImprovedCommander';

export class ChurchCommander extends ImprovedCommander {
  private needsWorker = true;

  protected getAction(): Action | Falsy {
    const type = this.getSpawnUnitType();
    const location = this.getSpawnLocation();

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
}
