import prisma from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/hash';
import { createToken } from '../../utils/token';

export async function createUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  const token = createToken({ id: user.id, email: user.email });
  return { user: { id: user.id, email: user.email }, token };
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = createToken({ id: user.id, email: user.email });
  return { user: { id: user.id, email: user.email }, token };
}
