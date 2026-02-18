import { Request, Response } from "express";
import { signupSchema, loginSchema } from "./auth.types";
import * as service from "./auth.service";
import { AuthRequest } from "../../middleware/authMiddleware";

export async function signup(req: Request, res: Response) {
  try {
    const parsed = signupSchema.parse(req.body);
    const result = await service.createUser(parsed.email, parsed.password);
    return res.status(201).json({ ok: true, ...result });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message || err });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await service.authenticateUser(parsed.email, parsed.password);

    // --- Set secure session cookie only ---
    res.cookie("sessiontoken", result.token, {
      httpOnly: true,
      secure: false,              // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Do NOT send the token back in the response
    return res.status(200).json({
      ok: true,
      message: "Logged in successfully",
      user: result.user, // optional
    });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message || err });
  }
}

export async function session(req: Request, res: Response) {
  const user = (req as AuthRequest).user;
  if (!user) return res.status(401).json({ ok: false, error: "Not authenticated" });
  return res.status(200).json({ ok: true, user });
}
