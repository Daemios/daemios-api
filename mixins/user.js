import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const user = {
  getUserByEmail: async (email) => prisma.user.findUnique({
    where: {
      email,
    },
  }),
  getUserById: async (id) => prisma.user.findUnique({
    where: {
      user_id: id,
    },
  }),
};

export default user;
