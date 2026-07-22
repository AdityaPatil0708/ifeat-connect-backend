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

  router.patch("/:id", async (req, res) => {
    const updated = await model.findOneAndUpdate({ id: req.params.id }, req.body ?? {}, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  router.delete("/:id", async (req, res) => {
    const deleted = await model.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  });

  return router;
}
