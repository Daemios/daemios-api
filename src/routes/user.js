import { PrismaClient } from '@prisma/client';
import express from 'express';
import characters from '../lib/characters.js';

const prisma = new PrismaClient();
const router = express.Router();

// Logout user
router.post('/logout', (req, res) => {
  characters.deactivateCharacters(req.user.user_id)
    .then(() => req.logout(() => res.json({ success: true })))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Server error during logout' });
    });
});

// Refresh character data
router.get('/refresh', async (req, res) => {
  try {
    const userId = req.session.passport.user.user_id;
    const character = await characters.getActiveCharacter(userId);

    if (!character || !character.character_id) {
      return res.status(404).json({ error: 'No active character found' });
    }
    const inventory = await characters.getInventory(character.character_id);
    res.json({ success: true, character, inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Select character
router.post('/character/select', async (req, res) => {
  try {
    const userId = req.session.passport.user.user_id;
    const { characterId } = req.body;

    await characters.deactivateCharacters(userId);
    const updateResult = await characters.activateCharacter(userId, characterId);

    if (!updateResult || updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'No character found or updated' });
    }
    const character = await characters.getActiveCharacter(userId);

    if (!character || !character.character_id) {
      return res.status(404).json({ error: 'No active character found' });
    }
    const inventory = await characters.getInventory(character.character_id);
    res.json({ success: true, character, inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Create character
router.post('/character/create', async (req, res) => {
  try {
    const userId = req.session.passport.user.user_id;
    const { name, raceId, image } = req.body;
    await prisma.userCharacter.create({
      data: {
        userId, name, raceId, image,
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
    const userId = req.session.passport.user.user_id;
    const rows = await prisma.userCharacter.findMany({
      where: { user_id: userId },
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No characters found' });
    }
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
