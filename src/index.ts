import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { connectDB } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { makeResourceRouter } from "./routes/resource.js";
import { Opportunity } from "./models/Opportunity.js";
import { Principal } from "./models/Principal.js";
import { Outreach } from "./models/Outreach.js";
import { Meeting } from "./models/Meeting.js";
dotenv.config()

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/opportunities", makeResourceRouter(Opportunity, "OPP"));
app.use("/api/principals", makeResourceRouter(Principal, "PRI"));
app.use("/api/outreach", makeResourceRouter(Outreach, "OUT"));
app.use("/api/meetings", makeResourceRouter(Meeting, "MTG"));

const port = Number(process.env.PORT) || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
