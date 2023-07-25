import { Art } from './Art';

export class Entity extends Art {
  constructor(model) {
    super(model);
    this.x = model.x;
    this.y = model.y;

    this.life = model.life;
    this.ap = model.ap;
    this.mp = model.mp;

    this.buffs = model.buffs;
    this.debuffs = model.debuffs;
  }

  isAlive(Entity) {
    return Entity.life > 0;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  resolveBuffs() {
    // TODO monkaS
  }

  resolveDebuffs() {
    // TODO monkaS
  }

  resolveAbility() {
    // TODO monkaS
  }
}
