import express from "express";

const app = express();
app.get("/", (_, res) => {
    res.send("Signaling Server is running");
});
export default app;