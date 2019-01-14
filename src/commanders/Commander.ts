import { BCAbstractRobot, SPECS } from 'battlecode';

export abstract class Commander {
  private r: BCAbstractRobot;
  private logPrefix: string;

  protected id: number;
  protected unit: number;
  protected health: number;
  protected team: number;
  protected x: number;
  protected y: number;
  protected fuel: number;
  protected karbonite: number;
  protected turn: number;
  protected time: number;

  protected globalFuel: number;
  protected globalKarbonite: number;
  protected lastOffer: number[][] | null;

  constructor(r: BCAbstractRobot) {
    this.r = r;
  }

  protected abstract initTurn(): void;
  protected abstract getAction(): Action | Falsy;

  public doTurn(): Action | Falsy {
    this.id = this.r.me.id;
    this.unit = this.r.me.unit;
    this.health = this.r.me.health;
    this.team = this.r.me.team;
    this.x = this.r.me.x;
    this.y = this.r.me.y;
    this.fuel = this.r.me.fuel;
    this.karbonite = this.r.me.karbonite;
    this.turn = this.r.me.turn;
    this.time = this.r.me.time;

    this.globalFuel = this.r.fuel;
    this.globalKarbonite = this.r.karbonite;
    this.lastOffer = this.r.last_offer;

    this.logPrefix = this.getLogPrefix();

    this.initTurn();

    return this.getAction();
  }

  protected isOnMap(x: number, y: number): boolean {
    return this.r._bc_check_on_map(x, y);
  }

  protected log(...message: any[]): void {
    const msg: string =
      message.length === 1 && typeof message[0] === 'string'
        ? message[0]
        : JSON.stringify(message.length === 1 ? message[0] : message);

    this.r._bc_logs.push(`${this.logPrefix} ${msg}`);
  }

  protected signal(value: number, radius: number): void {
    this.r.signal(value, radius);
  }

  protected castleTalk(value: number): void {
    this.r.castleTalk(value);
  }

  protected proposeTrade(karbonite: number, fuel: number): TradeAction {
    return this.r.proposeTrade(karbonite, fuel);
  }

  protected buildUnit(unit: number, dx: number, dy: number): BuildAction {
    return this.r.buildUnit(unit, dx, dy);
  }

  protected move(dx: number, dy: number): MoveAction {
    return this.r.move(dx, dy);
  }

  protected mine(): MineAction {
    return this.r.mine();
  }

  protected give(
    dx: number,
    dy: number,
    karbonite: number,
    fuel: number,
  ): GiveAction {
    return this.r.give(dx, dy, karbonite, fuel);
  }

  protected attack(dx: number, dy: number): AttackAction {
    return this.r.attack(dx, dy);
  }

  protected getRobot(id: number): Robot {
    return this.r.getRobot(id);
  }

  protected isVisible(robot: Robot): boolean {
    return this.r.isVisible(robot);
  }

  protected isRadioing(robot: Robot): boolean {
    return this.r.isRadioing(robot);
  }

  protected getVisibleRobotMap(): number[][] {
    return this.r.getVisibleRobotMap();
  }

  protected getPassableMap(): boolean[][] {
    return this.r.getPassableMap();
  }

  protected getKarboniteMap(): boolean[][] {
    return this.r.getKarboniteMap();
  }

  protected getFuelMap(): boolean[][] {
    return this.r.getFuelMap();
  }

  protected getVisibleRobots(): Robot[] {
    return this.r.getVisibleRobots();
  }

  protected unitTypeToString(type: number): string {
    switch (type) {
      case SPECS.CASTLE:
        return 'Castle';
      case SPECS.CHURCH:
        return 'Church';
      case SPECS.PILGRIM:
        return 'Pilgrim';
      case SPECS.CRUSADER:
        return 'Crusader';
      case SPECS.PROPHET:
        return 'Prophet';
      case SPECS.PREACHER:
        return 'Preacher';
    }

    return type.toString();
  }

  protected getLogPrefix(): string {
    const unit = this.unitTypeToString(this.unit);

    const padding = SPECS.MAX_ID.toString().length - this.id.toString().length;
    const spaces = ' '.repeat(padding);

    return `${spaces}[${unit} ${spaces}${this.id}]`;
  }
}
