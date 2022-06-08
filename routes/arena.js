const express = require('express');
const router = express.Router();
const wss = require('../mixins/socket')
const generate = require('../mixins/generate')

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
      wss.send(res.app.locals.arena.terrain)
    } else {
      wss.send('arena terrain not generated')
    }
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;
