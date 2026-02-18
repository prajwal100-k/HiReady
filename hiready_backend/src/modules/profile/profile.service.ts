import prisma from "../../config/db";
import { UpdateProfileInput } from "./profile.types";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      country: true,
      bio: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return updated;
}