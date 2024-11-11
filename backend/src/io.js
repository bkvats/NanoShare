import { Server } from "socket.io";
import asyncHandler from "./utils/asyncHandler.js";
import { AccessCode } from "./models/accessCode.model.js";
import apiResponse from "./utils/apiResponse.js";

export default function setupSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });
    io.on("connection", (socket) => {
        socket.on("register-code", async (code, callback) => {
            asyncHandler(async () => {
                await AccessCode.create({ accessCode: code, socketId: socket.id });
                if (callback) callback(apiResponse(200, "Access code mapped successfully"));
            })();
        });
        socket.on("disconnect", async () => {
            await AccessCode.findOneAndDelete({ socketId: socket.id });
        });
    });
}
