import "dotenv/config";
import express from "express";
import cors from "cors";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { toNodeHandler } from "better-auth/node";

// 1. DATABASE CONNECTION FROM ENV
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth = betterAuth({
  database: pool,
  // 2. FIXED INVALID ORIGIN ERROR
  trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"], 
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

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({ message: "Auth Server is running", status: "OK" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Auth Server running on http://localhost:${PORT}`);
});
