import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Read session token from cookie
  const token = req.cookies?.sessiontoken;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Not authenticated (missing session cookie)" });
  }

  try {
    const payload = verifyToken(token);
    if (!payload) throw new Error("Invalid token");

    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired session" });
  }
}
