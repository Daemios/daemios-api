import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characters = {
  getActiveCharacter: async (userId) => prisma.userCharacter.findFirst({
    where: {
      user_id: userId,
      active: 1,
    },
    include: {
      race: true, // Assuming 'race' is the relation field in your Prisma schema
    },
  }),
  activateCharacter: async (userId, characterId) => prisma.userCharacter.updateMany({
    where: {
      user_id: userId,
      character_id: characterId,
    },
    data: {
      active: 1,
    },
  }),
  deactivateCharacters: async (userId) => prisma.userCharacter.updateMany({
    where: { user_id: userId },
    data: { active: 0 },
  }),
  getInventory: async (characterId) => prisma.characterInventory.findMany({
    where: { character_id: characterId },
  }),
};

module.exports = characters;
