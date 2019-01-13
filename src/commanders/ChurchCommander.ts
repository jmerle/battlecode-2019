import { SPECS } from 'battlecode';
import { ImprovedCommander } from './ImprovedCommander';

export class ChurchCommander extends ImprovedCommander {
  protected getAction(): Action | Falsy {
    const type = this.getSpawnUnitType();
    const location = this.getSpawnLocation();

    if (
      this.globalKarbonite >= SPECS.UNITS[type].CONSTRUCTION_KARBONITE &&
      this.globalFuel >= SPECS.UNITS[type].CONSTRUCTION_FUEL &&
      location !== null
    ) {
      const [dx, dy] = location;

      const unit = this.unitTypeToString(type);
      const x = this.x + dx;
      const y = this.y + dy;
      this.log(`Spawning a ${unit} at (${x}, ${y})`);

      return this.buildUnit(type, dx, dy);
    }
  }

  private getSpawnUnitType(): number {
    const amountOfWorkers = this.getMyVisibleRobots().filter(
      robot => robot.unit === SPECS.PILGRIM,
    ).length;

    if (amountOfWorkers < 3) {
      return SPECS.PILGRIM;
    }

    return SPECS.PREACHER;
  }

  private getSpawnLocation(): [number, number] {
    const directions = this.getAvailableDirections();
    return directions.length > 0 ? directions[0] : null;
  }

  private getMyVisibleRobots(): Robot[] {
    return this.getVisibleRobots().filter(robot => robot.team === this.team);
  }
}
