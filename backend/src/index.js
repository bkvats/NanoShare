import "dotenv/config";
import dbConnect from "./db/index.js";
import http from "http"
import app from "./app.js";
import setupSocketIO from "./io.js";

await dbConnect();
const server = http.createServer(app);
setupSocketIO(server);
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});