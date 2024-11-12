import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { GoDotFill } from "react-icons/go";
import { MdOutlineBackspace } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";

const socket = getSocket();

export default function Receive() {
    const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
    const dispatch = useDispatch();
    return (
        <div>
            <p className="text-center text-4xl font-light my-10">Enter Access Key</p>
            <div className="w-full lg:w-1/2 flex justify-center gap-2 mx-auto">
                {
                    code.map((i, index) => (
                        <GoDotFill key={index} className={`text-5xl ${i == -1 ? "text-gray-600" : "text-white scale-110"} transition`} />
                    ))
                }
            </div>
            <div className="my-10 text-4xl mx-auto grid grid-cols-3 w-fit gap-6 lg:gap-8">
                {
                    "123456789".split("").map((number) => (
                        <button key={number} className="w-fit text-center mx-4 lg:hover:bg-gray-900 px-4 py-2 rounded-full transition duration-300" onClick={() => {
                            const newArray = [];
                            let found = false;
                            for (let i = 0; i < 6; i++) {
                                if (found || code[i] != -1) newArray.push(code[i]);
                                else if (code[i] == -1) {
                                    newArray.push(Number(number));
                                    found = true;
                                }
                            }
                            setCode(newArray);
                        }}>{number}</button>
                    ))
                }
                <button className="w-fit text-center mx-4 hover:bg-gray-900 rounded-full p-2 transition duration-300" onClick={() => {
                    const newArray = [...code];
                    let found = false;
                    for (let i = 5; i >= 0; i--) {
                        if (found || code[i] == -1) continue;
                        else if (code[i] != -1) {
                            newArray[i] = -1;
                            found = true;
                        }
                    }
                    setCode(newArray);
                }}><MdOutlineBackspace /></button>
                <button className="w-fit text-center mx-4 lg:hover:bg-gray-900 rounded-full px-4 py-2 transition duration-300" onClick={() => {
                    const newArray = [];
                    let found = false;
                    for (let i = 0; i < 6; i++) {
                        if (found || code[i] != -1) newArray.push(code[i]);
                        else if (code[i] == -1) {
                            newArray.push(0);
                            found = true;
                        }
                    }
                    setCode(newArray);
                }}>0</button>
                <button className="w-fit text-center mx-4 hover:bg-gray-900 hover:scale-125 rounded-full p-2 transition duration-300" onClick={() => {
                    if (code.includes(-1)) {
                        dispatch(displayToast({ message: "Enter access code first!", type: "error" }));
                        return;
                    }
                    socket.emit("check-code", code.join(""), (response) => {
                        if (response.success) {
                            // dispatch(displayToast());
                            socket.emit("getReceiverSocketId", {senderSocketId: response.data.socketId, receiverSocketId: socket.id});
                            // const pc = new RTCPeerConnection({
                            //     iceServers: [
                            //         { urls: "stun:stun.l.google.com:19302" }
                            //     ]
                            // });
                            // socket.on("sdp-offer", async (offer) => {
                            //     console.log("SDP offer received:", offer);
                            //     await pc.setRemoteDescription(new RTCSessionDescription(offer));
                            //     const answer = await pc.createAnswer();
                            //     await pc.setLocalDescription(answer);
                            //     socket.emit("sdp-answer", pc.localDescription);
                            //     console.log("succesfully added sdp offer")
                            // });
                            // socket.on("ice-canditate", async (canditate) => {
                            //     console.log("ICE Canditate Received:", candidate);
                            //     await pc.addIceCandidate(new RTCIceCandidate(canditate));
                            //     console.log("succesfully added ice candidate");
                            // })
                        }
                        else if (response.statusCode == 404) dispatch(displayToast({ message: "Invalid Access Code !", type: "error" }));
                    });
                }}><GoArrowRight /></button>
            </div>
        </div>
    );
}