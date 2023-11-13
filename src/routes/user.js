import { PrismaClient } from '@prisma/client';
import express from 'express';
import characters from '../lib/characters.js';

const prisma = new PrismaClient();
const router = express.Router();

// Logout user
router.post('/logout', (req, res) => {
  characters.deactivateCharacters(req.user.id)
    .then(() => req.logout(() => res.json({ success: true })))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Server error during logout' });
    });
});

// Refresh character data
router.get('/refresh', async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const character = await characters.getActiveCharacter(userId);

    if (!character || !character.id) {
      return res.status(404).json({ error: 'No active character found' });
    }
    const inventory = await characters.getInventory(character.id);
    res.json({ success: true, character, inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Select character
router.post('/character/select', async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const { characterId } = req.body;

    await characters.deactivateCharacters(userId);
    const rows = await characters.activateCharacter(userId, characterId);
    if (!rows || rows.count === 0) {
      return res.status(404).json({ error: 'No character found or updated' });
    }
    const character = await characters.getActiveCharacter(userId);

    if (!character || !character.id) {
      return res.status(404).json({ error: 'No active character found' });
    }
    const inventory = await characters.getInventory(characterId);
    res.json({ success: true, character, inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Create character
router.post('/character/create', async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    console.log('userId', userId);
    const { name, raceId, image } = req.body;
    console.log(req.body);
    await prisma.userCharacter.create({
      data: {
        name,
        image,
        user: {
          connect: { id: userId },
        },
        race: {
          connect: {
            id: raceId,
          },
        },
      },
    });

    res.status(200).json({ success: 'Character created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get characters
router.get('/characters', async (req, res) => {
  try {
    const userId = req.session.passport.user.id;
    const rows = await prisma.userCharacter.findMany({
      where: { userId },
    });
    const userCharacters = rows.map((row) => ({
      ...row,
      location: { dangerous: true, name: 'The Wilds' },
      level: 1,
      vessels: [{ color: '#156156' }, { color: '#a12078' }],
    }));

    res.json({ success: true, userCharacters });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
