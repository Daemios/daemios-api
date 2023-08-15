const pool = require('../mixins/db')

const characters = {
  getActiveCharacter: async (user_id) => {
    const conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM user_characters WHERE user_id = '${user_id}'
    AND active = 1`);
    await conn.release();
    return rows;
  },
  activateCharacter: async (user_id, character_id) => {
    const conn = await pool.getConnection();
    const rows = await conn.query(`UPDATE user_characters SET active = 1 WHERE user_id = '${user_id}' AND character_id = '${character_id}'`);
    await conn.release();
    return rows;
  },
  deactivateCharacters: async (user_id) => {
    const conn = await pool.getConnection();
    const rows = await conn.query(`UPDATE user_characters SET active = 0 WHERE user_id = '${user_id}'`);
    await conn.release();
    return rows;
  }
}