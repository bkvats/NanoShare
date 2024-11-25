import { io } from "socket.io-client";

export default function getSocket() {
    if (!socket) socket = io("http://192.168.22.28:3000");
    return socket;
}
let socket;