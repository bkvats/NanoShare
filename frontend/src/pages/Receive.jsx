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
    const [step, setStep] = useState(1);
    // const [senderSocketId, setSenderSocketId] = useState(null);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     console.log("in receiver useEffect");
    //     // if (step == 1) return;
    //     // console.log("after if condition");
    //     const pc = new RTCPeerConnection({
    //         iceServers: [
    //             { urls: "stun:stun.l.google.com:19302" }
    //         ],
    //         iceTransportPolicy: 'all' // Ensure this is not too restrictive
    //     });


    //     pc.onicecandidate = (event) => {
    //         if (event.candidate) {
    //             socket.emit("ice-candidate", {
    //                 candidate: event.candidate,
    //                 anotherEndSocketId: senderSocketId
    //             })
    //         }
    //     }

    //     socket.on("sdp-offer", async (offer) => {
    //         let chunks = [];
    //         pc.ondatachannel = (event) => {
    //             const dataChannel = event.channel;
    //             dataChannel.onopen = () => {
    //                 console.log("Data channel is opened on reciever side");
    //             }
    //             dataChannel.onclose = () => {
    //                 console.log("Data channel is closed on receiver side");
    // const receivedBlob = new Blob(chunks);
    // const downloadUrl = URL.createObjectURL(receivedBlob);

    // // Create a download link
    // const link = document.createElement("a");
    // link.href = downloadUrl;
    // link.download = "received_file"; // You can set the file name
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // console.log("File received and ready for download");
    //             }
    //             // dataChannel.onmessage((event) => {
    //             //     chunks.push(event.data);
    //             //     console.log("received chunk of size:", event.data.byteLength);
    //             // })
    //         }
    //         await pc.setRemoteDescription(new RTCSessionDescription(offer));
    //         const answer = await pc.createAnswer();
    //         await pc.setLocalDescription(answer);
    //         socket.emit("sdp-answer", {
    //             answer: pc.localDescription,
    //             senderSocketId
    //         });
    //     });

    //     socket.on("ice-candidate", async (candidate) => {
    //         await pc.addIceCandidate(new RTCIceCandidate(candidate));
    //     });

    // }, [])
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

                        let senderSocketId = "";
                        // console.log(pc);
                        socket.emit("check-code", code.join(""), (response) => {
                            if (response.success) {
                                // dispatch(displayToast());
                                senderSocketId = response.data.socketId;
                                socket.emit("getReceiverSocketId", { senderSocketId, receiverSocketId: socket.id });
                                setStep(prev => prev + 1);
                            }
                            else if (response.statusCode == 404) dispatch(displayToast({ message: "Invalid Access Code !", type: "error" }));
                        });

                        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

                        pc.ondatachannel = (event) => {
                            let chunks = [];
                            let fileType = "";
                            const dataChannel = event.channel;
                            dataChannel.onopen = () => {
                                console.log("Data channel is open to receive files");
                            }
                            dataChannel.onclose = () => {
                                console.log("Data Channel is close on receiver side");


                            }
                            dataChannel.onmessage = (event) => {
                                if (typeof event.data === "string") {
                                    if (event.data.includes("fileType")) {
                                        const metaData = JSON.parse(event.data);
                                        fileType = metaData.fileType;
                                        console.log("receiving file of type:", fileType);
                                    }
                                    else if (event.data === "EOF") {
                                        console.log("End of file");
                                        const receivedBlob = new Blob(chunks, {type: fileType});
                                        const downloadUrl = URL.createObjectURL(receivedBlob);
    
                                        // Create a download link
                                        const link = document.createElement("a");
                                        link.href = downloadUrl;
                                        link.download = "received_file"; // You can set the file name
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
    
                                        console.log("File received and ready for download");
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
                                senderSocketId
                            });
                        });

                        pc.onicecandidate = (event) => {
                            if (event.candidate) {
                                socket.emit("ice-candidate", {
                                    candidate: event.candidate,
                                    anotherEndSocketId: senderSocketId
                                });
                            }
                        }

                        socket.on("ice-candidate", async (candidate) => {
                            await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        });
                        // pc.onicegatheringstatechange = () => {
                        //     console.log('ICE gathering state on sender page:', pc.iceGatheringState);
                        // };



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