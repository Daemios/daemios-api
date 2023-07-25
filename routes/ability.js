const express = require('express');
const router = express.Router();
const pool = require('../mixins/db');

router.get('/elements', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM elements")
          .then((rows) => {
            let elements = {};
            rows.forEach(row => {
              elements[row.element_id] = row;
            })
            res.send(elements);
          })
          .then((res) => {
            conn.end();
          })
          .catch(err => {
            console.log(err)
            conn.end();
          })
      }).catch(err => {
      //not connected
      console.log(err)
    });
  } catch (e) {
    console.log(e)
  }
});

router.get('/types', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM ability_types")
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            conn.end();
          })
          .catch(err => {
            console.log(err)
            conn.end();
          })
      }).catch(err => {
      //not connected
      console.log(err)
    });
  } catch (e) {
    console.log(e)
  }
});

router.get('/shapes', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM ability_shapes")
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            conn.end();
          })
          .catch(err => {
            console.log(err)
            conn.end();
          })
      }).catch(err => {
      //not connected
      console.log(err)
    });
  } catch (e) {
    console.log(e)
  }
});

router.get('/ranges', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM ability_ranges")
          .then((rows) => {
            res.send(rows);
          })
          .then((res) => {
            conn.end();
          })
          .catch(err => {
            console.log(err)
            conn.end();
          })
      }).catch(err => {
      //not connected
      console.log(err)
    });
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;
