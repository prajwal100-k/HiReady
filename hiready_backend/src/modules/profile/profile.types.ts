import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  role: z.string().optional(),
  avatarUrl: z.string().optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
