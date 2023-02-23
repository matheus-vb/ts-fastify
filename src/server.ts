import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";

const app = fastify();

app.register(cookie)

app.register(transactionRoutes, {
    prefix: "transactions",
});

app.listen({
    port: parseInt(env.PORT),
}).then(() => {
    console.log("Server listening on port 3030");
});