import { Schema, model } from "mongoose";

const opportunitySchema = new Schema({
  id: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Distribution", "Direct Manufacturing", "Joint Venture", "Toll Manufacturing"],
  },
  revenue: { type: Number, required: true },
  probability: { type: Number, required: true },
  stage: {
    type: String,
    required: true,
    enum: ["Discovery", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
  },
});

opportunitySchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Opportunity = model("Opportunity", opportunitySchema);
