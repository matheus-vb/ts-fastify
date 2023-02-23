import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto from "node:crypto";

export async function transactionRoutes(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        const transactions = await knex("transactions").select("*");

        return reply.status(200).send({ data: transactions});
    })

    app.get("/:id", async (request, reply) => {
        const getTranssactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTranssactionParamsSchema.parse(request.params);

        const transaction = await knex("transactions").where("id", id).first();

        return reply.status(200).send({ data: transaction });
    })
    
    app.post("/", async (request, reply) => {
        
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        })

        const { title, amount, type } = createTransactionSchema.parse(request.body);

        await knex("transactions")
        .insert ({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * (-1),
        });


        return reply.status(201).send();
    });
}