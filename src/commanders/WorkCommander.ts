import { MovingCommander } from './MovingCommander';

export class WorkCommander extends MovingCommander {
  protected getAction(): Action | Falsy {
    return this.moveRandomly();
  }
}
