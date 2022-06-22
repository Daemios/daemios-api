const express = require('express');
const router = express.Router();
const wss = require('../mixins/socket')
const pool = require("../mixins/db");
const generate = require("../mixins/generate");

router.get('/terrain', function(req, res, next) {
  try {
    if (res.app.locals.world) {
      res.send(res.app.locals.world)
    } else {
      res.send('arena terrain not generated')
    }
  } catch (e) {
    console.log(e)
    wss.send('arena terrain not generated')
  }
});

module.exports = router;
