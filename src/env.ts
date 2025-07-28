import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	DEBUG: z.string().default("false"),
	GOOGLE_API_KEY: z.string(),
	LLM_MODEL: z.string().default("gemini-2.5-flash"),
});

export const env = envSchema.parse(process.env);
