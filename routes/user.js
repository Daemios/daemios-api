import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import characters from '../mixins/characters';

const prisma = new PrismaClient();
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const {
      email, password, password_confirm, display_name,
    } = req.body;

    if (!email || !password || !password_confirm || !display_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== password_confirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.users.create({
      data: { email, password: hashedPassword, display_name },
    });

    res.status(200).json({
      success: 'User created',
      user: { email, display_name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
    const { character_id } = req.body;

    await characters.deactivateCharacters(userId);
    const updateResult = await characters.activateCharacter(userId, character_id);

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
    const { name, race_id, image } = req.body;
    const result = await prisma.user_characters.create({
      data: {
        user_id: userId, name, race_id, image,
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
    const rows = await prisma.user_characters.findMany({
      where: { user_id: userId },
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No characters found' });
    }
    const characters = rows.map((row) => ({
      ...row,
      location: { dangerous: true, name: 'The Wilds' },
      level: 1,
      vessels: [{ color: '#156156' }, { color: '#a12078' }],
    }));

    res.json({ success: true, characters });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
