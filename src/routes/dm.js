import express from 'express';
import wss from '../lib/socket.js';

const router = express.Router();

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

export default router;
