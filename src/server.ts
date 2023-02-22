import fastify from "fastify";

const app = fastify();

app.get("/", () => {
    return "hello world";
});

app.listen({
    port: 3030,
}).then(() => {
    console.log("Server listening on port 3030");
});