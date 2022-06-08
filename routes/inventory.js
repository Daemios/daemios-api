const express = require('express');
const router = express.Router();
const pool = require('../mixins/db')

router.get('/:id', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        console.log(req.params.id)
        conn.query(`SELECT * FROM inventory WHERE character_id = ${req.params.id}`)
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
router.post('/:id', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        // TODO character_id isn't secure or authoritative, in future reference a session object
        conn.query(`INSERT INTO inventory (character_id, type_id, name, description, quantity, created_by)
            VALUES (${req.params.id}, ${req.body.type_id}, ${req.body.name}, ${req.body.description}, 
                    ${req.body.quantity}, 'client')
          `)
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
router.patch('/:id', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query(`UPDATE inventory 
                SET 
                    type_id = ${req.body.type_id},
                    name = ${req.body.name},
                    description = ${req.body.description},
                    quantity = ${req.body.quantity} 
                WHERE character_id = ${req.params.id}`)
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
