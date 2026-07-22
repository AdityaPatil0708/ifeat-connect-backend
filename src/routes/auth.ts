import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

authRouter.post("/signup", async (req, res) => {
  const { email, name, password } = req.body ?? {};
  if (!email || !name || !password) {
    return res.status(400).json({ error: "email, name and password are required" });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });
  res.status(201).json({ user });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure,
    maxAge: COOKIE_MAX_AGE,
  });
  res.json({ user });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: req.secure });
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user });
});
