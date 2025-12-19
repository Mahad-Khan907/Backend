// index.ts (Backend)
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
  "https://physical-ai-better-auth.vercel.app", // Your Vercel URL [cite: 631]
];

const auth = betterAuth({
  database: pool,
  trustedOrigins: FRONTEND_ORIGINS, // 

  // ✅ ADDED FOR COOKIES
  advanced: {
    crossSiteCookies: true, // Required for cross-domain sessions 
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
    credentials: true, // ✅ Must be true for cookies 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", toNodeHandler(auth));

app.listen(process.env.PORT || 3001, () => {
  console.log(`✅ Auth Server running`);
});
