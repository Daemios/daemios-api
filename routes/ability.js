import { PrismaClient } from '@prisma/client';

const express = require('express');

const router = express.Router();

const prisma = new PrismaClient();
router.get('/elements', async (req, res) => {
  try {
    const rows = await prisma.elements.findMany();
    const elements = {};
    rows.forEach((row) => {
      elements[row.element_id] = row;
    });
    res.send(elements);
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
});

router.get('/types', async (req, res) => {
  try {
    const rows = await prisma.ability_types.findMany();
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
});

router.get('/shapes', async (req, res, next) => {
  try {
    const rows = await prisma.ability_shapes.findMany();
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
});

router.get('/ranges', async (req, res, next) => {
  try {
    const rows = await prisma.ability_ranges.findMany();
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
