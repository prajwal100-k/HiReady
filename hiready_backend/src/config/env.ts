import dotenv from 'dotenv';
dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

for (const k of required) {
  if (!process.env[k]) {
    console.warn(`Warning: ${k} is not set in environment.`);
  }
}

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  PORT: Number(process.env.PORT || 8000),
};
