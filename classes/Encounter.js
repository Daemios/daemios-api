const Arena = require("../classes/Arena");

class Encounter {
  constructor(model) {

    // --------------------------------------------------------------
    // Configuration
    // --------------------------------------------------------------
    this.turn_duration = 10000; // milliseconds


    // --------------------------------------------------------------
    // State
    // --------------------------------------------------------------
    this.turns = 0;

    // This entities object determines the temp ids for all entities.
    this.entities = new Map;

    // Initiative is like the "true" list of entities, where they can be
    // added (summons), removed (on death) or shuffled around.
    this.initiative = null;

    // This is the index of initiative that can currently take actions.
    this.active_index = null;

    // The arena currently being played in.
    this.arena = new Arena({});
  }

  addEntity(entity, from_entity = null) {
    this.entities.push(entity);

    if (from_entity) {
      // find the from_entity in the entities array and get its index
      let from_index = this.entities.findIndex((e) => e === from_entity);

      // find the from_entity in the initiative array and get its index
      let initiative_index = this.initiative.findIndex((e, index) => index === from_index);

      // Now that we know where the source entity is in the initiative array,
      // we can insert the new entity into the initiative array.
      this.insertIntoInitiative(entity, initiative_index);
    } else {
      this.insertIntoInitiative(entity);
    }

  }

  insertIntoInitiative(entity, after_index) {
    if (!after_index) {
      this.initiative.push(entity);
    }
    // splits initiative array and adds after target index
    this.initiative.splice(after_index, 0, entity);
  }

  removeFromInitiative(id) {
    this.initiative = this.initiative.filter((entity) => entity.id !== id);
  }

  startTurn(entity) {
    entity.resolveBuffs()
    entity.resolveDebuffs()

    // Begin timer for next turn
    setTimeout(() => {
      this.endTurn();
    }, this.turn_duration);
  }

  endTurn() {

  }

  endArena() {
    // TODO shuts down the arena gracefully, calculates rewards, etc.
  }

  killArena() {
    // TODO use this if things go wrong so you can free up the characters
  }
}

module.exports = Encounter;
