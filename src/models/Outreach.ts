import { Schema, model } from "mongoose";

const outreachSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true },
  channel: { type: String, required: true, enum: ["Email", "LinkedIn", "WhatsApp", "Phone"] },
  campaign: { type: String, required: true },
  outcome: {
    type: String,
    required: true,
    enum: ["Sent", "Opened", "Replied", "Meeting Booked", "No Response"],
  },
});

outreachSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Outreach = model("Outreach", outreachSchema);
