import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            softwareBackground: { type: "string", required: false, input: true },
            hardwareBackground: { type: "string", required: false, input: true },
        },
    },
    trustedOrigins: ["https://physical-ai-better-auth-bymahad.vercel.app/"], // Trust Docusaurus locally
});
