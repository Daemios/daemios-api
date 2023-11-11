import { PrismaClient } from '@prisma/client';

const router = require('express').Router();

const prisma = new PrismaClient();

router.get('/races', async (req, res) => {
  try {
    const rows = await prisma.race.findMany();
    res.send({
      success: true,
      races: rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
});

export default router;
