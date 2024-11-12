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
        console.log("a user is connected:", socket.id);
        socket.on("get-code", (callback) => {
            asyncHandler(async () => {
                let code = "";
                do {
                    code = `${Math.floor(100000 + Math.random() * 900000)}`;
                } while (await !AccessCode.findOne({ accessCode: code }));
                await AccessCode.create({ accessCode: code, socketId: socket.id });
                if (callback) callback(apiResponse(200, "Access code mapped successfully", { code }));
            })();
        });

        socket.on("check-code", (code, callback) => {
            asyncHandler(async () => {
                const accessCode = await AccessCode.findOne({ accessCode: code });
                if (accessCode) return callback(apiResponse(200, "Socket Id found", { socketId: accessCode.socketId }));
                callback(apiResponse(404, "No Socked Id found"));
            })();
        });

        socket.on("getReceiverSocketId", (ids) => {
            console.log("ids received from receiver:", ids);
            io.to(ids.senderSockedId).emit("getReceiverSocketId", ids.receiverSocketId);
        });
        
        socket.on("disconnect", async () => {
            console.log("a user is disconnected:", socket.id);
            await AccessCode.findOneAndDelete({ socketId: socket.id });
        });
    });
}
