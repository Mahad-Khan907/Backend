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
  "https://physical-ai-better-auth.vercel.app",
];

const auth = betterAuth({
  database: pool,
  trustedOrigins: FRONTEND_ORIGINS,

  // ✅ UPDATED CONFIGURATION
  advanced: {
    // Better Auth handles the domain automatically based on BETTER_AUTH_URL.
    // Ensure that your cookies are allowed to be sent cross-site:
    cookies: {
        // This ensures cookies are sent over HTTPS and work cross-domain
        sameSite: "none", 
        secure: true,
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
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", toNodeHandler(auth));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Auth Server running on port ${PORT}`);
});
