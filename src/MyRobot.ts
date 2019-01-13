import { BCAbstractRobot, SPECS } from 'battlecode';
import { CastleCommander } from './commanders/CastleCommander';
import { ChurchCommander } from './commanders/ChurchCommander';
import { CombatCommander } from './commanders/CombatCommander';
import { Commander } from './commanders/Commander';
import { WorkCommander } from './commanders/WorkCommander';

class MyRobot extends BCAbstractRobot {
  private commander: Commander;

  public turn(): Action | Falsy {
    if (this.me.turn === 1) {
      switch (this.me.unit) {
        case SPECS.CASTLE:
          this.commander = new CastleCommander(this);
          break;
        case SPECS.CHURCH:
          this.commander = new ChurchCommander(this);
          break;
        case SPECS.PILGRIM:
          this.commander = new WorkCommander(this);
          break;
        default:
          this.commander = new CombatCommander(this);
      }
    }

    return this.commander.doTurn();
  }
}

// tslint:disable-next-line no-unused-expression
new MyRobot();
