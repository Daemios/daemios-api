import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characters = {
  getActiveCharacter: async (userId) => prisma.userCharacter.findFirst({
    where: {
      user: {
        id: userId,
      },
      active: true,
    },
    include: {
      race: true, // Assuming 'race' is the relation field in your Prisma schema
    },
  }),
  activateCharacter: async (userId, characterId) => prisma.userCharacter.updateMany({
    where: {
      user: {
        id: userId,
      },
      id: characterId,
    },
    data: {
      active: true,
    },
  }),
  deactivateCharacters: async (userId) => prisma.userCharacter.updateMany({
    where: {
      user: {
        id: userId,
      },
    },
    data: { active: false },
  }),
  getInventory: async (id) => prisma.characterInventory.findMany({
    where: { id },
  }),
};

export default characters;
