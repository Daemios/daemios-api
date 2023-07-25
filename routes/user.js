const router = require('express').Router();
const pool = require('../mixins/db')
const bcrypt = require('bcrypt');
const passport = require('passport');


router.post('/login', passport.authenticate('local'), (req, res, next) => {
  if (req.user) {
    res.send({
      success: true,
      display_name: req.user.display_name
    });
  }
});

router.post('/register', async(req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      console.log('No body')
      res.sendStatus(400);
    } else if (req.body.password !== req.body.password_confirm) {
      res.send({
        error: 'Passwords do not match'
      })
    } else if (req.body.password.length < 5) {
      res.send({
        error: 'Password must be at least 5 characters'
      })
    } else if (!req.body.email || !req.body.password) {
      res.send({
        error: 'Email and password are required'
      })
    } else if (!req.body.display_name) {
      res.send({
        error: 'Display name is required'
      })
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      pool.getConnection()
        .then(conn => {
          conn.query(`INSERT INTO users (email, password, display_name) VALUES ('${req.body.email}', '${hashedPassword}', '${req.body.display_name}')`)
            .then((rows) => {
              if (rows.affectedRows === 1) {
                res.send({
                  success: 'User created',
                  user: {
                    email: req.body.email,
                    display_name: req.body.display_name
                  }
                })
              } else {
                res.sendStatus(500);
              }
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
    }
  } catch (e) {
    console.log(e)
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  res.send({
    success: true
  });
});

router.post('/character/select', (req, res) => {
  pool.getConnection()
    .then(conn => {

    });
});

router.get('/characters', async(req, res, next) =>  {
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM player_characters WHERE user_id = '${req.session.passport.user.user_id}'`)
        .then((rows) => {
          if (rows.length > 0) {
            res.send({
              success: true,
              characters: rows
            })
          } else {
            res.send({
              error: 'No characters found',
              characters: []
            })
          }
        })
    })
});

router.get('/character/builder/presets', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT preset_id, ap.preset_core_id, element_id, ability_range_id, " +
          "ability_shape_id, ability_type_id, power, cost, cooldown, duration, " +
          "ap.description AS preset_description, ar.name AS range_name, ar.description AS range_description, " +
          "ar.tag AS range_tag, additional_range, ash.name AS shape_name, ash.tag AS shape_tag, additional_area, " +
          "aty.name AS type_name, aty.description AS type_description, aty.tag AS type_tag, " +
          "apc.name AS preset_core_name, apc.description AS preset_core_description, " +
          "CONCAT(ar.tag,',',ash.tag,',',aty.tag) AS tags " +
          "FROM ability_presets ap " +
          "LEFT JOIN ability_ranges ar ON ap.`range` = ar.ability_range_id " +
          "LEFT JOIN ability_shapes ash ON ap.`shape` = ash.ability_shape_id " +
          "LEFT JOIN ability_types aty ON ap.`type` = aty.ability_type_id " +
          "LEFT JOIN ability_preset_cores apc ON ap.preset_core_id = apc.preset_core_id")
          .then((rows) => {
            let presets = {};
            rows.forEach(row => {
              if (!(row.preset_core_id in presets)) {
                presets[row.preset_core_id] = {};
              }
              presets[row.preset_core_id][row.element_id] = row;
            })
            res.send(presets)
          })
          .then((res) => {
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
