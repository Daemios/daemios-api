const pool = require('../mixins/db')

const user = {
  getUserByEmail: async (email) => {
    const conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM users WHERE email = '${email}'`);
    await conn.release();
    return rows[0];
  },
  getUserById: async (id) => {
    const conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM users WHERE id = '${id}'`);
    await conn.release();
    return rows[0];
  }
}

module.exports = user;
