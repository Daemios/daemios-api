const express = require('express');

const router = express.Router();
const wss = require('../mixins/socket');

router.get('/terrain', (req, res) => {
  try {
    if (res.app.locals.world) {
      res.send(res.app.locals.world);
    } else {
      res.send('arena terrain not generated');
    }
  } catch (e) {
    console.log(e);
    wss.send('arena terrain not generated');
  }
});

export default router;
