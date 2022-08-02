const router = require('express').Router();
const pool = require('../mixins/db')
const bcrypt = require('bcrypt');
const passport = require('passport');
const auth = require('../mixins/auth');

router.post('/authenticate', passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.user) {
      res.send({
        success: true,
        user_id: req.user.user_id,
        display_name: req.user.display_name
      });
    }
  }
);

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
        console.log(req.body.password)
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

router.get('/characters', async(req, res, next) =>  {
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM player_characters WHERE user_id = '${req.body.user_id}'`)
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

module.exports = router;
