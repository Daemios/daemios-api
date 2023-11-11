import { PrismaClient } from '@prisma/client';

const router = require('express').Router();

const prisma = new PrismaClient();

const wss = require('../mixins/socket');

// TODO completely rework this
router.post('/combat/start', async (req, res) => {
  req.session.encounter = new Encounter();
  wss.send('combat_start', req.session.encounter);
  res.sendStatus(200);
});

router.post('/combat/end', async (req, res) => {
  req.session.encounter = null;
  wss.send('combat_end', req.session.encounter);
  res.sendStatus(200);
});

module.exports = router;
