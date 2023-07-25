const router = require('express').Router();
const pool = require('../mixins/db')

router.get('/races', async(req, res, next) => {
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM races`)
        .then(rows => {
          res.send({
            success: true,
            races: rows
          })
        })
    })
});

module.exports = router;