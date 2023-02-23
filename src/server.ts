import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";

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
    port: 3030,
}).then(() => {
    console.log("Server listening on port 3030");
});