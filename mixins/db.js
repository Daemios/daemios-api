const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  connectionLimit: 100,
  database: process.env.db_database,
});
module.exports = pool;
