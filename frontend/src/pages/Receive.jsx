import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { GoDotFill } from "react-icons/go";
import { MdOutlineBackspace } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";
import { displayLoader, setIsLoading } from "../store/loaderSlice";
import FileIcon from "../components/FileIcon";
import sizeConverter from "../utils/sizeConverter";

const socket = getSocket();

export default function Receive() {
    const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
    const [step, setStep] = useState(1);
    const [dataInfo, setDataInfo] = useState("Total 7 file/s of 336.56 MB");
    const [infoOfFiles, setInfoOfFiles] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const dispatch = useDispatch();
    return (
        <>
            {step == 1 &&
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
                                let innerDownloadFiles = [];
                                socket.emit("check-code", code.join(""), (response) => {
                                    if (response.success) {
                                        senderSocketId = response.data.socketId;
                                        socket.emit("setupNewConnection", { senderSocketId, receiverSocketId: socket.id });
                                        dispatch(displayLoader("Establishing a secure connection..."));
                                    }
                                    else {
                                        dispatch(setIsLoading(false));
                                        if (response.statusCode == 400) dispatch(displayToast({ message: response.message, type: "warning" }));
                                        else if (response.statusCode == 404) dispatch(displayToast({ message: "Invalid Access Code !", type: "error" }));
                                    }
                                });

                                const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

                                pc.ondatachannel = (event) => {
                                    let chunks = [];
                                    let fileType = "";
                                    let fileName = "";
                                    setDataChannel(event.channel);
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
                                            if (data.type === "dataInfo") {
                                                setInfoOfFiles(data.infoOfFiles)
                                                dispatch(setIsLoading(false));
                                                setStep(prev => prev + 1);
                                            }
                                            else if (data.type === "fileInfo") {
                                                fileType = data.fileType;
                                                fileName = data.fileName;
                                                console.log("Receving file of type:", fileType, "\nName:", fileName);
                                            }
                                            else if (data.type === "response") {
                                                if (data.EOF) {
                                                    console.log("file received succesfully....");
                                                    const blob = new Blob(chunks, { type: fileType });
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
                                        dataChannel.onerror = (error) => {
                                            console.log("error in datachannel", error);
                                        }
                                    }
                                    dataWorker.onmessage = (event) => {
                                        const {file} = event.data;
                                        // setFileReceivedSize(file.receivedSize);
                                        // setTransferSpeed(speed);
                                        // setReceivedPercentage(receivedPercentage);
                                        // setTimeLeft(timeLeft);
                                        console.log("saved size:", file.chunks.at(-1).byteLength);
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

                                socket.on("ice-candidate", async ({ candidate }) => {
                                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                                });
                            }
                            catch (error) {
                                dispatch(displayToast({ message: "Something went wrong, Please try again!", type: "error" }));
                                dispatch(setIsLoading(false));
                                throw error;
                            }
                        }}><GoArrowRight /></button>
                    </div>
                </div >
            }
            {
                step == 2 &&
                <div className="flex flex-col items-center">
                    <p className="text-2xl my-8 text-white-light font-light">Total <span className="text-white font-black">{`${infoOfFiles.length} file/s`} </span> of <span className="text-white font-black">{`${sizeConverter(infoOfFiles.map(i => i.filesize).reduce((a, b) => a + b))}`}</span></p>
                    <div className="border-white border-dashed bg-opacity-70 border rounded-2xl text-2xl w-[97%] lg:w-1/2 h-80 p-4 flex flex-wrap overflow-y-auto gap-2 justify-evenly items-start">
                        {
                            infoOfFiles.map((file, index) => (
                                <div key={index} className="max-w-24 px-2 max-h-36 overflow-hidden flex flex-col gap-2 my-4 relative">
                                    {
                                        <>
                                            <span className="text-5xl self-center"><FileIcon filename={file.filename} filetype={file.filetype} /></span>
                                            <p className="text-base line-clamp-3 font-light text-center">{file.filename}</p>
                                        </>
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <button
                    className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10 hover:scale-110 transition"
                    onClick={() => {
                        dataChannel.send(JSON.stringify({type: "trigger", startSending: true}))
                    }}
                    >Receive</button>
                </div>
            }
        </>
    );
}