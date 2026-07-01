import { Schema, model } from "mongoose";

const meetingSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  company: { type: String, required: true },
  attendee: { type: String, required: true },
  objective: { type: String, required: true },
  owner: { type: String, required: true },
  outcome: { type: String },
  followUp: { type: String },
  priority: { type: String, required: true, enum: ["A", "B", "C"] },
});

meetingSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Meeting = model("Meeting", meetingSchema);
