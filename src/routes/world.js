import express from 'express';
import wss from '../lib/socket.js';

const router = express.Router();

router.get('/terrain', (req, res) => {
  try {
    if (res.app.locals.world) {
      res.send(res.app.locals.world);
    } else {
      res.send('arena terrain not generated');
    }
  } catch (e) {
    console.error(e);
    wss.send('arena terrain not generated');
  }
});

export default router;
