import { Schema, model } from "mongoose";

const principalSchema = new Schema({
  id: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  category: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  priority: { type: String, required: true, enum: ["A", "B", "C"] },
  status: {
    type: String,
    required: true,
    enum: ["Identified", "Contacted", "Responded", "Meeting Set", "Met", "Negotiation", "Won", "Lost"],
  },
  score: { type: Number, required: true },
  meetingDate: { type: String },
  owner: { type: String, required: true },
});

principalSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Principal = model("Principal", principalSchema);
