import "dotenv/config";
import express from "express";
import cors from "cors";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { toNodeHandler } from "better-auth/node";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "https://physical-ai-better-auth.vercel.app",
];

const auth = betterAuth({
  database: pool,
  trustedOrigins: FRONTEND_ORIGINS,

  advanced: {
    // ✅ Fix for TS2559: Use defaultCookieAttributes to set SameSite and Secure
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true, // Required for sameSite: "none"
      httpOnly: true,
    }
  },

  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      softwareBackground: { type: "string" },
      hardwareBackground: { type: "string" },
    },
  },
});

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", toNodeHandler(auth));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Auth Server running on port ${PORT}`);
});
