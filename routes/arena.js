const express = require('express');
const router = express.Router();
const wss = require('../mixins/socket')

router.post('/move', function(req, res, next) {
  try {
    let accepted = false;
    console.log('validating movement')
    // Validate the movement here
    if (true) {
      accepted = true;
    }
    res.send(accepted);
    res.send('movement', 'test')
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

module.exports = router;
