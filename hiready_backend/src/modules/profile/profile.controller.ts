import { Request, Response } from "express";
import * as service from "./profile.service";

export async function getMyProfile(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  const profile = await service.getProfile(userId);
  return res.json({ ok: true, profile });
}

export async function updateMyProfile(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  const updated = await service.updateProfile(userId, req.body);
  return res.json({ ok: true, profile: updated });
}
