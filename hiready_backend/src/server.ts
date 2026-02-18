import { createApp } from './app';
import prisma from './config/db';
import { ENV } from './config/env';

const app = createApp();



async function start() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.warn('Database connection failed:', err);
  }
  app.listen(ENV.PORT, () => {
    console.log(`Server running on http://localhost:${ENV.PORT}`);
  });
}

start();
