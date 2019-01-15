import { SPECS } from 'battlecode';
import { Cell } from '../models/Cell';
import { ImprovedCommander } from './ImprovedCommander';

export class CombatCommander extends ImprovedCommander {
  private scores = {
    [SPECS.CASTLE]: 0,
    [SPECS.CHURCH]: 1,
    [SPECS.PREACHER]: 2,
    [SPECS.CRUSADER]: 3,
    [SPECS.PROPHET]: 4,
    [SPECS.PILGRIM]: 5,
  };

  private unvisited: Cell[] = [];
  private lastTarget: Cell = null;
  private castleReceivingDone = false;
  private castleTargets: Cell[] = [];

  protected getAction(): Action | Falsy {
    if (!this.castleReceivingDone) {
      this.readCastleCoordinates();
    }

    if (!this.castleReceivingDone) {
      return;
    }

    const enemies = this.cells.filter(
      cell =>
        (cell.hasAttacker() || cell.hasBuilding()) &&
        cell.robot.team !== this.team,
    );

    const attackableEnemies = enemies
      .filter(cell => this.cell.isInRange(cell, this.attackRangeMax))
      .sort((a, b) => this.scores[a.robot.unit] - this.scores[b.robot.unit]);

    if (attackableEnemies.length > 0) {
      return this.attackAt(attackableEnemies[0]);
    }

    const targets = enemies
      .map(cell => cell.getCellsInRange(this.attackRangeMax))
      .reduce((a, b) => a.concat(b), [])
      .filter(cell => cell.canMoveTo());

    if (targets.length > 0) {
      return this.moveToNearestTarget(targets);
    }

    return this.explore();
  }

  private readCastleCoordinates(): void {
    let hasSeenBuilding = false;

    for (const cell of this.cells) {
      if (cell.hasBuilding() && cell.robot.team === this.team) {
        hasSeenBuilding = true;

        if (cell.robot.signal >= 10000) {
          const signalStr = cell.robot.signal.toString();
          const x = parseInt(signalStr.substr(1, 2), 10);
          const y = parseInt(signalStr.substr(3, 2), 10);

          this.castleTargets.push(this.map[y][x]);
        }
      }
    }

    if (this.castleTargets.length > 0 || !hasSeenBuilding) {
      this.castleReceivingDone = true;
    }
  }

  private explore(): Action | Falsy {
    this.castleTargets = this.castleTargets.filter(
      target => target.canMoveTo() && !this.cell.isInRange(target, this.vision),
    );

    if (this.castleTargets.length > 0) {
      return this.moveToNearestTarget(this.castleTargets);
    }

    if (this.unvisited.length === 0) {
      this.unvisited = [...this.cells];
    }

    this.unvisited = this.unvisited.filter(
      cell => cell.canMoveTo() && !this.cell.isInRange(cell, this.vision),
    );

    if (this.unvisited.indexOf(this.lastTarget) > -1) {
      return this.moveTo(this.lastTarget);
    } else {
      this.lastTarget = this.unvisited[
        Math.floor(Math.random() * this.unvisited.length)
      ];

      return this.moveTo(this.lastTarget);
    }
  }
}
