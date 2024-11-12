import { io } from "socket.io-client";

export default function getSocket() {
    if (!socket) socket = io("http://192.168.1.36:3000");
    return socket;
}
let socket;