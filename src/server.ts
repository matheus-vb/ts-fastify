import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/", async () => {
    const transaction = await knex("transactions").insert({
        id: crypto.randomUUID(),
        title: "Teste",
        amount: 1,
    }).returning("*");

    return transaction;
});

app.listen({
    port: parseInt(env.PORT),
}).then(() => {
    console.log("Server listening on port 3030");
});