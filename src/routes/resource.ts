import { Router } from "express";
import type { Model } from "mongoose";
import { requireAuth } from "../middleware/auth.js";

export function makeResourceRouter(model: Model<any>, prefix: string) {
  const router = Router();
  router.use(requireAuth);

  router.get("/", async (_req, res) => {
    const items = await model.find().sort({ _id: -1 });
    res.json(items);
  });

  router.post("/", async (req, res) => {
    const body = req.body ?? {};
    const count = await model.countDocuments();
    const id = `${prefix}-${String(count + 1).padStart(3, "0")}`;
    const created = await model.create({ ...body, id });
    res.status(201).json(created);
  });

  return router;
}
