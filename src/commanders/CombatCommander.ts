import { MovingCommander } from './MovingCommander';

export class CombatCommander extends MovingCommander {
  protected getAction(): Action | Falsy {
    return this.moveRandomly();
  }
}
