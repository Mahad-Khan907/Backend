import "dotenv/config";
import express from "express";
import cors from "cors";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { toNodeHandler } from "better-auth/node";

// ==============================
// DATABASE CONNECTION
// ==============================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ==============================
// FRONTEND ORIGINS (LOCAL + VERCEL)
// ==============================
const FRONTEND_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://physical-ai-better-auth-bymahad.vercel.app",
  "https://physical-ai-better-auth.vercel.app",
];

// ==============================
// BETTER-AUTH CONFIG
// ==============================
const auth = betterAuth({
  database: pool,

  // ✅ TRUST YOUR FRONTENDS
  trustedOrigins: FRONTEND_ORIGINS,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      softwareBackground: { type: "string" },
      hardwareBackground: { type: "string" },
    },
  },
});

// ==============================
// EXPRESS APP
// ==============================
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

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Auth Server is running",
  });
});

// ==============================
// SERVER START
// ==============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Auth Server running on http://localhost:${PORT}`);
});
