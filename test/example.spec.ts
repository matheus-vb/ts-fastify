import { afterAll, beforeAll, expect, test, describe, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Transaction routes", () => {
    beforeAll( async () => {
        app.ready();
    })
    
    afterAll( async () => {
        app.close();
    })

    beforeEach( () => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    })
    
    test("user can create new transaction", async () => {
        const response = await request(app.server)
            .post("/transactions")
            .send({
                title: "new transaction",
                amount: 1200,
                type: "credit",
            });
    
        expect(response.statusCode).toEqual(201);
    })

    test("user can list transactions", async () => {
        const createNewTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "new transaction",
                amount: 1200,
                type: "credit",
            });

        const cookies = createNewTransactionResponse.get("Set-Cookie")

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)

        expect(listTransactionsResponse.statusCode).toEqual(200);

        expect(listTransactionsResponse.body.data).toEqual([
            expect.objectContaining({
                title: "new transaction",
                amount: 1200,
            })
        ])
    })

    test("user can get a specific transactions", async () => {
        const createNewTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "new transaction",
                amount: 1200,
                type: "credit",
            });

        const cookies = createNewTransactionResponse.get("Set-Cookie")

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)

        expect(listTransactionsResponse.statusCode).toEqual(200);

        const transactionId = listTransactionsResponse.body.data[0].id;

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set("Cookie", cookies)

        expect(getTransactionResponse.statusCode).toEqual(200);

        expect(getTransactionResponse.body.data).toEqual(
            expect.objectContaining({
                title: "new transaction",
                amount: 1200,
            })
        )
    })

    test("user can get summary", async () => {
        const createNewTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "debit transaction",
                amount: 1200,
                type: "debit",
            });

        const cookies = createNewTransactionResponse.get("Set-Cookie")

        await request(app.server)
            .post("/transactions")
            .set("Cookie", cookies)
            .send({
                title: "credit transaction",
                amount: 6800,
                type: "credit",
            });

        const summaryResponse = await request(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookies)

        expect(summaryResponse.statusCode).toEqual(200);

        expect(summaryResponse.body.data).toEqual(
            expect.objectContaining({
                amount: 5600,
            })
        )
    })
})

