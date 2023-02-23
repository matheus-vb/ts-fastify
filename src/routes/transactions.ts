import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";

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
    
    app.get("/summary", async (request, reply) => {
        const summary = await knex("transactions")
        .sum("amount", { as: "amount"})
        .first()

        return reply.status(200).send({ data: summary });
    })

    app.post("/", async (request, reply) => {
        
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        })

        const { title, amount, type } = createTransactionSchema.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId) {
            sessionId = randomUUID();

            reply.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: 1000 * 60 * 60
            })
        }

        await knex("transactions")
        .insert ({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * (-1),
            session_id: sessionId
        });


        return reply.status(201).send();
    });
}