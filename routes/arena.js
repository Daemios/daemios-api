const express = require('express');
const router = express.Router();
const wss = require('../mixins/socket')
const pool = require("../mixins/db");
const crypto = require('crypto')
const generate = require("../mixins/generate");

router.post('/move', function(req, res, next) {
  try {
    let accepted = false;
    console.log('validating movement')
    // Validate the movement here
    if (true) {
      accepted = true;
    }
    res.send(accepted);
    wss.send('movement', 'test')
  } catch (e) {
    console.log(e)
  }
});
router.get('/terrain', function(req, res, next) {
  try {
    if (res.app.locals.arena.terrain) {
      res.send(res.app.locals.arena.terrain)
    } else {
      res.send('arena terrain not generated')
    }
  } catch (e) {
    console.log(e)
    wss.send('arena terrain not generated')
  }
});
router.get('/list', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query("SELECT * FROM arena_history ORDER BY created_on DESC LIMIT 10")
          .then((arenas) => {
            if (arenas) {
              conn.query(`SELECT * FROM arena_history ORDER BY last_active DESC LIMIT 1`)
                .then((active) => {
                  if (active) {
                    res.send({
                      active_arena_history_id: active[0].arena_history_id,
                      saved_arenas: arenas
                    });
                  }
                })
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
  } catch (e) {
    console.log(e)
  }
});
router.get('/single/:id', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query(`SELECT * FROM arena_history WHERE arena_history_id = ${req.params.id}`)
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
router.delete('/single/:id', function(req, res, next) {
  try {
    // Body is empty again

    if (req.params.id) {
      pool.getConnection()
        .then(conn => {
          conn.query(`DELETE FROM arena_history WHERE arena_history_id = ${req.params.id}`)
            .then((rows) => {
              if (rows.affectedRows > 0) {
                conn.query(`SELECT * FROM arena_history ORDER BY last_updated DESC LIMIT 10`)
                  .then((rows) => {
                    if (rows) {
                      res.send(rows);
                    }
                  })
                  .then((res) => {
                    conn.end();
                  })
                  .catch(err => {
                    console.log(err)
                    conn.end();
                  })
              }
            })
        }).catch(err => {
        //not connected
        console.log(err)
      });

    } else {
      res.send('Missing args for arena/delete')
    }
  } catch (e) {
    console.log(e)
  }
});
router.post('/load/:id', function(req, res, next) {
  try {
    pool.getConnection()
      .then(conn => {
        conn.query(`SELECT * FROM arena_history WHERE arena_history_id = ${req.params.id} LIMIT 1`)
          .then((single) => {
            if (single) {
              conn.query(`UPDATE arena_history SET last_active = NOW() WHERE arena_history_id = ${single[0].arena_history_id}`)
                .then((updated) => {
                  if (updated) {
                    conn.query(`SELECT * FROM arena_history ORDER BY created_on DESC LIMIT 10`)
                      .then((arenas) => {
                        if (arenas) {
                          conn.query(`SELECT * FROM arena_history ORDER BY last_active DESC LIMIT 1`)
                            .then((active) => {
                              if (active) {
                                console.log(single.size, single.seed)
                                req.app.locals.arena.terrain = generate.arena.terrain(single[0].size, single[0].seed)
                                wss.send('arena', req.app.locals.arena)
                                res.send({
                                  active_arena_history_id: active[0].arena_history_id,
                                  saved_arenas: arenas
                                });
                              }
                            })
                        }
                      })
                  }
                })
            }
          })
          .then((res) => {
            conn.end();
          })
          .catch(err => {
            //not connected
            console.log(err)
          });
      }).catch(err => {
      //not connected
      console.log(err)
    });
  } catch (e) {
    console.log(e)
  }
});
router.post('/create', function(req, res, next) {
  try {
    const body = req.body;
    if (body.name && body.size) {
      const seed = crypto.randomBytes(20).toString('hex');
      pool.getConnection()
        .then(conn => {
          conn.query(`INSERT INTO arena_history (name, seed, size) VALUES ('${body.name}', '${seed}', ${body.size})`)
            .then((rows) => {
              if (rows.affectedRows > 0) {
                conn.query(`SELECT * FROM arena_history ORDER BY last_updated DESC LIMIT 10`)
                  .then((rows) => {
                    if (rows) {
                      req.app.locals.arena.terrain = generate.arena.terrain(body.size, seed)
                      wss.send('arena', req.app.locals.arena)
                      res.send(rows);
                    }
                  })
                  .then((res) => {
                    conn.end();
                  })
                  .catch(err => {
                    console.log(err)
                    conn.end();
                  })
              }
            })
            .catch(err => {
              console.log(err)
              conn.end();
            })
        }).catch(err => {
        //not connected
        console.log(err)
      });

    } else {
      res.code(500).send()
    }
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;

