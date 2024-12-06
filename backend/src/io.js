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
        socket.on("get-code", (allowMultipleReceivers, callback) => {
            asyncHandler(async () => {
                let code = "";
                do {
                    code = `${Math.floor(100000 + Math.random() * 900000)}`;
                } while (await !AccessCode.findOne({ accessCode: code }));
                await AccessCode.create({ accessCode: code, socketId: socket.id });
                callback(apiResponse(200, "Access code mapped successfully", { code }));
            })();
        });

        socket.on("check-code", (code, callback) => {
            asyncHandler(async () => {
                const accessCode = await AccessCode.findOne({ accessCode: code });
                if (accessCode) {
                    if (accessCode.isSending) return callback(apiResponse(200, "Socket Id found", { socketId: accessCode.socketId }));
                    return callback(apiResponse(400, "Sender has blocked multiple receivers!"));
                }
                return callback(apiResponse(404, "No Socked Id found"));
            })();
        });

        socket.on("change-permission", ({senderSocketId, isSending}) => {
            asyncHandler(async () => {
                await AccessCode.findOneAndUpdate({socketId: senderSocketId}, {
                    $set: {
                        isSending
                    }
                });
            })();
        })

        socket.on("setupNewConnection", (ids) => {
            io.to(ids.senderSocketId).emit("setupNewConnection", ids.receiverSocketId);
        });

        socket.on("sdp-offer", (data) => {
            io.to(data.receiverSocketId).emit("sdp-offer", data.offer);
        });

        socket.on("sdp-answer", (data) => {
            io.to(data.senderSocketId).emit("sdp-answer", { answer: data.answer, receiverSocketId: data.receiverSocketId });
        });

        socket.on("ice-candidate", ({ candidate, anotherEndSocketId, receiverSocketId }) => {
            io.to(anotherEndSocketId).emit("ice-candidate", { candidate, receiverSocketId });
        });

        socket.on("disconnect", async () => {
            await AccessCode.findOneAndDelete({ socketId: socket.id });
        });
    });
}
