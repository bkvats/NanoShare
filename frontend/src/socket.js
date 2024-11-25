import { io } from "socket.io-client";

export default function getSocket() {
    if (!socket) socket = io("https://nanoshare-backend.onrender.com/");
    return socket;
}
let socket;