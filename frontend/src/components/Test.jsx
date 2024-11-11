import React, { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Test() {
    const [message, setMessage] = useState("");
    const socket = io("http://localhost:3000");
    useEffect(() => {
        socket.on("receive-signal", (data) => {
            console.log("Data recieved from backend", data);
        })
        socket.on("connect", () => {
            console.log("Connected succesfully", socket.id);
        });
        socket.on("disconnect", () => {
            console.log("Disconnected succesfully");
        })
        return () => {socket.disconnect()}
    }, []);
    return (
        <div className="pt-24">
            <input type="text" value={message} onChange={(event) => {setMessage(event.target.value)}} className="text-black"/>
            <button className="mx-10" onClick={() => {
                console.log("sending signal to backend");
                socket.emit("send-signal", {id: "f-kZ2XIARhgGmN3kAAAz", message});
            }}>Send</button>
        </div>
    )
}