import { SPECS } from 'battlecode';
import { Cell } from '../models/Cell';
import { ImprovedCommander } from './ImprovedCommander';

export class WorkCommander extends ImprovedCommander {
  private shouldMineKarbonite: boolean;

  protected getAction(): Action | Falsy {
    const neededKarbonite =
      SPECS.UNITS[SPECS.PILGRIM].CONSTRUCTION_KARBONITE * 3;
    this.shouldMineKarbonite = this.globalKarbonite < neededKarbonite;

    if (this.shouldDeliver()) {
      return this.deliver();
    } else if (this.shouldMine()) {
      if (this.globalFuel > 0) {
        return this.mine();
      }
    } else {
      return this.goToTarget();
    }
  }

  protected shouldDeliver(): boolean {
    return (
      this.karbonite === this.karboniteCapacity ||
      this.fuel === this.fuelCapacity
    );
  }

  protected deliver(): Action | Falsy {
    const buildings = this.cell.neighbors.filter(
      cell => cell.hasBuilding() && cell.robot.team === this.team,
    );

    if (buildings.length > 0) {
      return this.giveTo(buildings[0], this.karbonite, this.fuel);
    } else {
      const targets: Cell[] = [];

      for (const cell of this.cells) {
        if (cell.hasBuilding() && cell.robot.team === this.team) {
          for (const neighbor of cell.neighbors) {
            if (neighbor.canMoveTo()) {
              targets.push(neighbor);
            }
          }
        }
      }

      return this.moveToNearestTarget(targets);
    }
  }

  protected shouldMine(): boolean {
    return this.shouldMineKarbonite
      ? this.cell.hasKarbonite
      : this.cell.hasFuel;
  }

  protected goToTarget(): Action | Falsy {
    const targets = this.cells.filter(
      cell =>
        (this.shouldMineKarbonite ? cell.hasKarbonite : cell.hasFuel) &&
        cell.canMoveTo(),
    );

    return this.moveToNearestTarget(targets);
  }
}
