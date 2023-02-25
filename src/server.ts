import { app } from "../src/app";
import { env } from "./env";

app.listen({
    port: parseInt(env.PORT),
}).then(() => {
    console.log("Server listening on port 3030");
});