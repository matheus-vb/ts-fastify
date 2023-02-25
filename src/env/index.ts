import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
    config ({ path: ".env.test"});
} else {
    config();
}

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development", "test"]),
    DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3031),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error(_env.error.format());

    throw new Error("invalid environment");
}

export const env = _env.data;
