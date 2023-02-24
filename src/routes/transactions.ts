import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export async function transactionRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request, reply) => {
        console.log(`${request.method} => ${request.url}`)
    })

    app.get("/", {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const { sessionId } = request.cookies

        const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

        return reply.status(200).send({ data: transactions});
    })

    app.get("/:id", {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const getTranssactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { sessionId } = request.cookies;
        const { id } = getTranssactionParamsSchema.parse(request.params);

        const transaction = await knex("transactions").where({
            id,
            session_id: sessionId
        }).first();

        return reply.status(200).send({ data: transaction });
    })
    
    app.get("/summary", {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const { sessionId } = request.cookies;
        
        const summary = await knex("transactions")
        .sum("amount", { as: "amount"})
        .where("session_id", sessionId)
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