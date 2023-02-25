import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie)

app.register(transactionRoutes, {
    prefix: "transactions",
});