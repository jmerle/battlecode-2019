import { ImprovedCommander } from './ImprovedCommander';

export class CombatCommander extends ImprovedCommander {
  protected getAction(): Action | Falsy {
    return this.moveRandomly();
  }
}
