import React, { useState, useRef } from "react";
import { GoDotFill } from "react-icons/go";
import { MdOutlineBackspace } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";
import { displayLoader, setIsLoading } from "../store/loaderSlice";
import FileIcon from "../components/FileIcon";
import sizeConverter from "../utils/sizeConverter";
import SimpleProgressCard from "../components/SimpleProgressCard";
import { decodeJson, encodeJson } from "../utils/jsonResponse";

const socket = getSocket();

export default function Receive() {
    const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState([]);
    const [controlChannel, setControlChannel] = useState(null);
    const [transferSpeed, setTransferSpeed] = useState(0);
    const [receivedpercentage, setReceivedPercentage] = useState(0);
    const [fileReceivedSize, setFileReceivedSize] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const videoRef = useRef(null);
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
                    <div className="py-10 text-4xl mx-auto grid grid-cols-3 w-fit gap-6 lg:gap-8">
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
                                    if (response.success) {
                                        senderSocketId = response.data.socketId;
                                        socket.emit("setupNewConnection", { senderSocketId, receiverSocketId: socket.id });
                                    }
                                    else {
                                        dispatch(setIsLoading(false));
                                        if (response.statusCode == 400) dispatch(displayToast({ message: response.message, type: "warning" }));
                                        else if (response.statusCode == 404) dispatch(displayToast({ message: "Invalid Access Code !", type: "error" }));
                                    }
                                });

                                const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                                let fastFiles = [];
                                let i = 0;
                                pc.ondatachannel = (event) => {
                                    const dataChannel = event.channel;
                                    dataChannel.binaryType = "arraybuffer";
                                    setControlChannel(dataChannel);
                                    dataChannel.send(encodeJson("get-files"));
                                    dataChannel.onmessage = (event) => {
                                        if (typeof event.data === "string") {
                                            const message = decodeJson(event.data);
                                            if (message.type === "files") {
                                                fastFiles = [...message.data];
                                                setFiles(fastFiles);
                                                dispatch(setIsLoading(false));
                                                setStep(prev => prev + 1);
                                            }
                                        }
                                        else {
                                            const file = fastFiles[i];
                                            if (!file.startTime) file.startTime = Date.now();
                                            const chunkData = event.data;
                                            file.chunks.push(chunkData);
                                            file.received += chunkData.byteLength;
                                            setTimeout(() => {
                                                setFileReceivedSize(prev => {
                                                    const newSize = prev + chunkData.byteLength;
                                                    setReceivedPercentage((newSize * 100 / file.filesize));
                                                    const speed = (newSize / ((Date.now() - file.startTime) / 1000));
                                                    setTransferSpeed(speed);
                                                    setTimeLeft((file.filesize - newSize) / speed);
                                                    return newSize;
                                                });
                                            }, 1000);
                                            if (file.received == file.filesize) {
                                                const blob = new Blob(file.chunks, { type: file.filetype });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = `NanoShare_${file.filename}`;
                                                a.click();
                                                fastFiles[i].status = "completed";
                                                fastFiles[i].downloadUrl = url;
                                                i++;
                                                fastFiles[i].status = "active";
                                                setFiles([...fastFiles]);
                                                setFileReceivedSize(0);
                                                setReceivedPercentage(0);
                                                setTransferSpeed(0);
                                                setTimeLeft(0);
                                                if (i < fastFiles.length) {
                                                    setTimeout(() => {
                                                        dataChannel.send(encodeJson("send-file", i));
                                                    }, 2000)
                                                }
                                                else videoRef.current.pause();
                                            }
                                        }
                                    }
                                }
                                socket.on("sdp-offer", async (offer) => {
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
                            }
                        }}><GoArrowRight /></button>
                    </div>
                </div >
            }
            {
                step == 2 &&
                <div className="flex flex-col items-center">
                    <p className="text-2xl my-8 text-white-light font-light">Total <span className="text-white font-black">{`${files.length} file/s`} </span> of <span className="text-white font-black">{`${sizeConverter(files.map(i => i.filesize).reduce((a, b) => a + b))}`}</span></p>
                    <div className="border-white border-dashed bg-opacity-70 border rounded-2xl text-2xl w-[97%] lg:w-1/2 h-80 p-4 flex flex-wrap overflow-y-auto gap-2 justify-evenly items-start">
                        {
                            files.map((file, index) => (
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
                            controlChannel.send(encodeJson("send-file", 0));
                            setStep(prev => prev + 1);
                        }}
                    >Receive</button>
                </div>
            }
            {
                step == 3 &&
                <div className="flex justify-center">
                    <div className="fixed bottom-0">
                        <video style={{ height: "calc(100vh - 8.5rem)" }} ref={videoRef} src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4" className="object-cover object-center" autoPlay loop />
                    </div>
                    <div className="border-0 overflow-auto w-[97%] lg:w-1/2">
                        {
                            files.map((file) => (
                                <SimpleProgressCard {...file} status={file.status} speed={transferSpeed} timeLeft={timeLeft} receivedSize={fileReceivedSize} receivedPercentage={receivedpercentage} downloadurl={file.downloadUrl} key={file.filename} />
                            ))
                        }
                    </div>
                </div>
            }
        </>
    );
}