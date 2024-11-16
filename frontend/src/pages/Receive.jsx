import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { GoDotFill } from "react-icons/go";
import { MdOutlineBackspace } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";
import { displayLoader, setIsLoading } from "../store/loaderSlice";

const socket = getSocket();

export default function Receive() {
    const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
    const [step, setStep] = useState(1);
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
                    try {
                        dispatch(displayLoader("Verifying Code..."));
                        let senderSocketId = "";
                        socket.emit("check-code", code.join(""), (response) => {
                            dispatch(setIsLoading(false));
                            if (response.success) {
                                senderSocketId = response.data.socketId;
                                socket.emit("setupNewConnection", { senderSocketId, receiverSocketId: socket.id });
                                setStep(prev => prev + 1);
                            }
                            else if (response.statusCode == 400) dispatch(displayToast({message: response.message, type: "warning"}));
                            else if (response.statusCode == 404) dispatch(displayToast({ message: "Invalid Access Code !", type: "error" }));
                        });

                        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

                        pc.ondatachannel = (event) => {
                            let chunks = [];
                            let fileType = "";
                            let fileName = "";
                            const dataChannel = event.channel;
                            dataChannel.onopen = () => {
                                console.log("Data channel is open to receive files");
                            }
                            dataChannel.onclose = () => {
                                console.log("Data Channel is close on receiver side");
                            }
                            dataChannel.onmessage = (event) => {
                                if (typeof event.data === "string") {
                                    const data = JSON.parse(event.data);
                                    if (data.type === "fileInfo") {
                                        fileType = data.fileType;
                                        fileName = data.fileName;
                                        console.log("Receving file of type:", fileType, "\nName:", fileName);
                                    }
                                    if (data.type === "response") {
                                        if (data.EOF) {
                                            console.log("file received succesfully....");
                                            const blob = new Blob(chunks, {type: fileType});
                                            const downloadUrl = URL.createObjectURL(blob);
                                            const link = document.createElement("a");
                                            link.href = downloadUrl;
                                            link.hidden = true;
                                            link.download = `NanoShare_${fileName}`
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            chunks = [];
                                        }
                                    }
                                }
                                else {
                                    chunks.push(event.data);
                                    console.log("recieved file chunk of size:", event.data.byteLength);
                                }
                            }
                        }

                        socket.on("sdp-offer", async (offer) => {
                            console.log("got sdp offer on receiver side:", offer);
                            await pc.setRemoteDescription(new RTCSessionDescription(offer));
                            const answer = pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            socket.emit("sdp-answer", {
                                answer: pc.localDescription,
                                senderSocketId,
                                receiverSocketId: socket.id
                            });
                        });

                        pc.onicecandidate = (event) => {
                            if (event.candidate) {
                                socket.emit("ice-candidate", {
                                    candidate: event.candidate,
                                    anotherEndSocketId: senderSocketId,
                                    receiverSocketId: socket.id
                                });
                            }
                        }

                        socket.on("ice-candidate", async ({candidate}) => {
                            await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        });
                    }
                    catch (error) {
                        dispatch(displayToast({ message: "Something went wrong, Please try again!", type: "error" }));
                        console.log(error.message);
                    }
                }}><GoArrowRight /></button>
            </div>
        </div >
    );
}