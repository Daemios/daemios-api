const router = require('express').Router();
const pool = require('../mixins/db')
const wss = require("../mixins/socket");
const Encounter = require("../classes/Encounter");


router.post('/combat/start', async(req, res, next) => {
  req.session.encounter = new Encounter();
  wss.send('combat_start', req.session.encounter)
  res.sendStatus(200);
});

router.post('/combat/end', async(req, res, next) => {
  req.session.encounter = null;
  wss.send('combat_end', req.session.encounter)
  res.sendStatus(200);
});

module.exports = router;
