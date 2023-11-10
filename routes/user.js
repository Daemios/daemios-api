const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const pool = require('../mixins/db');
const characters = require('../mixins/characters');

router.post('/register', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      console.log('No body');
      res.sendStatus(400);
    } else if (req.body.password !== req.body.password_confirm) {
      res.send({
        error: 'Passwords do not match',
      });
    } else if (req.body.password.length < 5) {
      res.send({
        error: 'Password must be at least 5 characters',
      });
    } else if (!req.body.email || !req.body.password) {
      res.send({
        error: 'Email and password are required',
      });
    } else if (!req.body.display_name) {
      res.send({
        error: 'Display name is required',
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      pool.getConnection()
        .then((conn) => {
          conn.query(`INSERT INTO users (email, password, display_name) VALUES ('${req.body.email}', '${hashedPassword}', '${req.body.display_name}')`)
            .then((rows) => {
              if (rows.affectedRows === 1) {
                res.send({
                  success: 'User created',
                  user: {
                    email: req.body.email,
                    display_name: req.body.display_name,
                  },
                });
              } else {
                res.sendStatus(500);
              }
            })
            .then((res) => {
              conn.end();
            })
            .catch((err) => {
              console.log(err);
              conn.end();
            });
        }).catch((err) => {
        // not connected
          console.log(err);
        });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/logout', (req, res) => {
  console.log(req.user.user_id);
  characters.deactivateCharacters(req.user.user_id)
    .then(() => {
      req.logout(() => {
        res.send({
          success: true,
        });
      });
    });
});

router.get('/refresh', async (req, res) => {
  try {
    // get the active character for the user

    const userId = req.session.passport.user.user_id;

    // Now, fetch the updated character data
    const character = await characters.getActiveCharacter(userId);

    if (character.character_id) {
      // Get the characters inventory
      const inventory = await characters.getInventory(character.character_id);

      res.send({
        success: true,
        character,
        inventory,
      });
    } else {
      res.send({
        error: 'No active character found',
        character: {},
      });
    }
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send({
      error: 'An error occurred',
    });
  }
});

router.post('/character/select', async (req, res) => {
  try {
    const userId = req.session.passport.user.user_id;
    const characterId = req.body.character_id;

    // First, deactivate all characters for the user
    await characters.deactivateCharacters(userId);

    // Then, activate the selected character
    const updateResult = await characters.activateCharacter(userId, characterId);

    // Check if any row has been updated
    if (updateResult.affectedRows > 0) {
      // Now, fetch the updated character data
      const character = await characters.getActiveCharacter(userId);

      if (character.character_id) {
        // Get the characters inventory
        const inventory = await characters.getInventory(character.character_id);

        res.send({
          success: true,
          character,
          inventory,
        });
      } else {
        res.send({
          error: 'No active character found',
          character: {},
        });
      }
    } else {
      res.send({
        error: 'No character found or updated',
        character: {},
      });
    }
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send({
      error: 'An error occurred',
    });
  }
});

router.post('/character/create', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = 'INSERT INTO user_characters (user_id, name, race_id, image) VALUES (?, ?, ?, ?)';
    const values = [req.session.passport.user.user_id, req.body.name, req.body.race_id, req.body.image]; // Assuming you are getting an image in the request
    const rows = await conn.query(sql, values);

    if (rows.affectedRows === 1) {
      res.status(200).json({ success: 'Character created' });
    } else {
      res.sendStatus(500); // You might want to send back a more informative error message
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (conn) conn.release(); // release the connection back to the pool
  }
});

router.get('/characters', async (req, res, next) => {
  pool.getConnection()
    .then((conn) => {
      conn.query(`SELECT * FROM user_characters WHERE user_id = '${req.session.passport.user.user_id}'`)
        .then((rows) => {
          if (rows.length > 0) {
            const characters = [];
            // Add a location key to each character
            rows.forEach((row) => {
              characters.push({
                ...row,
                location: {
                  dangerous: true,
                  name: 'The Wilds',
                },
                level: 1,
                vessels: [
                  {
                    color: '#156156',
                  },
                  {
                    color: '#a12078',
                  },
                ],
              });
            });
            res.send({
              success: true,
              characters,
            });
          } else {
            res.send({
              error: 'No characters found',
              characters: [],
            });
          }
        });
    });
});

module.exports = router;
