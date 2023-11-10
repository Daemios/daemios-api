const pool = require('./db');

const characters = {
  getActiveCharacter: async (userId) => {
    const conn = await pool.getConnection();
    let character = [];
    [character] = await conn.execute(
      'SELECT * FROM user_characters WHERE user_id = ? AND active = 1',
      [userId],
    );
    [character.race] = await conn.execute(
      `SELECT * FROM races WHERE race_id = ${character.race_id}`,
    );
    await conn.release();
    return character;
  },
  activateCharacter: async (userId, characterId) => {
    const conn = await pool.getConnection();
    const result = await conn.execute(
      'UPDATE user_characters SET active = 1 WHERE user_id = ? AND character_id = ?',
      [userId, characterId],
    );
    await conn.release();
    return result;
  },
  deactivateCharacters: async (userId) => {
    const conn = await pool.getConnection();
    const result = await conn.execute(
      'UPDATE user_characters SET active = 0 WHERE user_id = ?',
      [userId],
    );
    await conn.release();
    return result;
  },
  getInventory: async (characterId) => {
    const conn = await pool.getConnection();
    const rows = await conn.execute(
      'SELECT * FROM inventory WHERE character_id = ?',
      [characterId],
    );
    await conn.release();
    return rows;
  },
};

module.exports = characters;
