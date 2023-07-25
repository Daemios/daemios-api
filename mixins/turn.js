export default {
  // These two resolve in sequence at the start of a turn.
  resolveBuffs(Entity) {

  },
  resolveDebuffs(Entity) {

  },

  // These two resolve during a turn.
  resolveMovement(Entity) {

    Entity.isAlive();
  },
  resolveAction(Entity) {


    Entity.isAlive();
  },
}
