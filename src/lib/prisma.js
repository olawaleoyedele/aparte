// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prisma;

if (typeof window === 'undefined') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  // If you ever import this in client code by mistake, avoid breaking
  prisma = null;
}

export default prisma;
