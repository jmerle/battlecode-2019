import { ImprovedCommander } from './ImprovedCommander';

export class WorkCommander extends ImprovedCommander {
  protected getAction(): Action | Falsy {
    return this.moveRandomly();
  }
}
