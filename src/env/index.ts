import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.string().default("3031"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error(_env.error.format());

    throw new Error("invalid environment");
}

export const env = _env.data;
