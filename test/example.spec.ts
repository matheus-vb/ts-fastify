import { afterAll, beforeAll, expect, test, describe } from "vitest";
import { app } from "../src/app";
import request from "supertest";

describe("Transaction routes", () => {
    beforeAll( async () => {
        app.ready();
    })
    
    afterAll( async () => {
        app.close();
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
})

