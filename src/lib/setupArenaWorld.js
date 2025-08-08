import { PrismaClient } from '@prisma/client';
import generate from './generate.js';
import wss from './socket.js';

export default async function setupArenaWorld(app) {
  const prisma = new PrismaClient();

  // Initialize arena data
  app.locals.arena = {};
  try {
  const last = await prisma.arenaHistory.findFirst({
      orderBy: { last_active: 'desc' },
    });
    if (last) {
      app.locals.arena.terrain = generate.arena.simplexTerrain(last.size, last.seed);
      wss.send('arena', app.locals.arena);
    }
  } catch (e) {
    console.error(e);
  }

  // Initialize world data
  app.locals.world = {
    size: 256,
    seed: 'einstein2',
  };
  wss.send('world', app.locals.world);
}
