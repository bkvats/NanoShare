import React, { useRef, useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { CiSquarePlus } from "react-icons/ci";
import FileIcon from "../components/FileIcon";
import { FaEye, } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { MdContentCopy, MdNoEncryptionGmailerrorred } from "react-icons/md";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";
import ToggleButton from "../components/ToggleButton";
import { displayLoader, setIsLoading } from "../store/loaderSlice";
import sizeConverter from "../utils/sizeConverter";
import { decodeJson, encodeJson } from "../utils/jsonResponse";

const socket = getSocket();

export default function Send() {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [step, setStep] = useState(1);
    const [accessCode, setAccessCode] = useState("");
    const [showAccessCode, setShowAccessCode] = useState(false);
    const [allowMultipleReceivers, setAllowMultipleReceivers] = useState(false);
    const videoRef = useRef(null);
    const dispatch = useDispatch();

    return (
        <>
            {
                step == 1 &&
                <div className="flex flex-col items-center px-4 lg:px-0">
                    {files.length == 0 ? <div className={`border-white border-dashed bg-black bg-opacity-70 border rounded-2xl text-2xl w-[97%] lg:w-1/2 h-80 flex flex-col justify-center items-center gap-2 hover:bg-slate-900 transition cursor-pointer ${isDragging && "bg-slate-900"}`}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => {
                            setIsDragging(false);
                        }}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            setFiles([...files, ...Array.from(event.dataTransfer.files)])
                        }}
                        onClick={() => {
                            if (inputRef) inputRef.current.click();
                        }}
                    >
                        <CiSquarePlus size={"4rem"} />
                        <span className="text-xl">Select files or Drag and drop here</span>
                    </div> :
                        <div className={`border-white border-dashed bg-opacity-70 border rounded-2xl text-2xl w-[97%] lg:w-1/2 h-80 p-4 flex flex-wrap overflow-y-auto gap-2 justify-evenly items-start ${isDragging && "bg-slate-900"}`}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => {
                                setIsDragging(false);
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                setIsDragging(false);
                                setFiles([...files, ...Array.from(event.dataTransfer.files)])
                            }}
                        >
                            {
                                files.map((file, index) => (
                                    <div key={index} className="max-w-24 px-2 max-h-36 overflow-hidden flex flex-col gap-2 my-4 relative">
                                        {
                                            <>
                                                <button onClick={(event) => {
                                                    setFiles(prev => prev.filter((_, currIndex) => currIndex != index));
                                                }} >
                                                    <TfiClose color="red" className="absolute right-0 text-2xl z-10 lg:hover:bg-[#ffffff2b] cursor-pointer rounded-full p-1" />
                                                </button>
                                                <span className="text-5xl self-center"><FileIcon filename={file.name} filetype={file.type} /></span>
                                                <p className="text-base line-clamp-3 font-light text-center">{file.name}</p>
                                            </>
                                        }
                                    </div>
                                ))
                            }
                            <button onClick={() => {
                                inputRef.current.click();
                            }} className="p-4 rounded-full bg-[#ffffff5f] hover:bg-slate-600 my-4">
                                <CiSquarePlus size={"3rem"} />
                            </button>
                        </div>}
                    <input
                        multiple
                        ref={inputRef}
                        type="file"
                        onChange={(event) => {
                            setFiles([...files, ...Array.from(event.target.files)]);
                        }}
                        hidden />
                    <span className="flex gap-3 text-xl font-light items-center mt-4">Allow Multiple Receivers:
                        <ToggleButton isToggled={allowMultipleReceivers} setIsToggled={setAllowMultipleReceivers} />
                    </span>
                    <button className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10 hover:scale-110 transition" onClick={() => {
                        if (files.length > 0) {
                            dispatch(displayLoader());
                            try {
                                const peerConnections = new Map();
                                const iceCandidates = new Map();
                                const remoteDescriptionSet = new Map();
                                socket.emit("get-code", allowMultipleReceivers, async (response) => {
                                    if (response.success) {
                                        setAccessCode(response.data.code);
                                        dispatch(setIsLoading(false));
                                        setStep(prev => prev + 1);
                                    }
                                    else {
                                        dispatch(displayToast({ message: "Something went wrong please try again !", type: "error" }));
                                    }
                                    return;
                                });

                                socket.on("setupNewConnection", async (receiverSocketId) => {
                                    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                                    peerConnections.set(receiverSocketId, pc);
                                    iceCandidates.set(receiverSocketId, []);
                                    remoteDescriptionSet.set(receiverSocketId, false);
                                    const dataChannel = pc.createDataChannel("dataChannel");
                                    dataChannel.binaryType = "arraybuffer";
                                    function sendFile(file) {
                                        function sendNextChunk() {
                                            if (offset < file.size) {
                                                if (dataChannel.bufferedAmount < chunkSize * 10) {
                                                    const chunk = file.slice(offset, offset + chunkSize);
                                                    fileReader.readAsArrayBuffer(chunk);
                                                    offset += chunkSize;
                                                }
                                                else {
                                                    setTimeout(sendNextChunk, 100);
                                                }

                                            }
                                            else {
                                                console.log("File sent succesfully");
                                                videoRef.current.pause();
                                            }
                                        }
                                        let offset = 0;
                                        const chunkSize = 256 * 1024;
                                        const fileReader = new FileReader();
                                        fileReader.onload = (event) => {
                                            const chunk = event.target.result;
                                            dataChannel.send(chunk);
                                            sendNextChunk();
                                        }
                                        sendNextChunk();
                                    }
                                    dataChannel.onmessage = (event) => {
                                        const message = decodeJson(event.data);
                                        if (message.type === "get-files") {
                                            dataChannel.send(JSON.stringify({
                                                type: "files", data: files.map((i, index) => {
                                                    return {
                                                        filename: i.name,
                                                        filetype: i.type,
                                                        filesize: i.size,
                                                        status: index == 0 ? "active" : "waiting",
                                                        chunks: [],
                                                        received: 0,
                                                        startTime: 0,
                                                        downloadUrl: ""
                                                    }
                                                })
                                            }));
                                        }
                                        else if (message.type === "send-file") {
                                            videoRef.current.play();
                                            sendFile(files[message.data]);
                                        }
                                    }
                                    dataChannel.onclose = (_) => {
                                        videoRef.current.pause();
                                    }
                                    pc.onicecandidate = (event) => {
                                        if (event.candidate) {
                                            socket.emit("ice-candidate", {
                                                candidate: event.candidate,
                                                anotherEndSocketId: receiverSocketId,
                                            });
                                        }
                                    }
                                    const offer = await pc.createOffer();
                                    await pc.setLocalDescription(offer);
                                    socket.emit("sdp-offer", {
                                        offer: pc.localDescription,
                                        receiverSocketId
                                    });
                                });

                                socket.on("sdp-answer", async ({ answer, receiverSocketId }) => {
                                    await peerConnections.get(receiverSocketId).setRemoteDescription(new RTCSessionDescription(answer));
                                    remoteDescriptionSet.set(receiverSocketId, true);
                                    iceCandidates.get(receiverSocketId).map((candidate) => {
                                        peerConnections.get(receiverSocketId).addIceCandidate(new RTCIceCandidate(candidate));
                                    });
                                    iceCandidates.set(receiverSocketId, []);
                                });

                                socket.on("ice-candidate", async ({ candidate, receiverSocketId }) => {
                                    if (remoteDescriptionSet.get(receiverSocketId)) {
                                        await peerConnections.get(receiverSocketId).addIceCandidate(new RTCIceCandidate(candidate));
                                    }
                                    else {
                                        iceCandidates.get(receiverSocketId).push(candidate);
                                    }
                                });
                            }
                            catch (error) {
                                dispatch(displayToast({ message: "Something went wrong please try again !", type: "error" }));
                            }
                        }
                        else {
                            dispatch(displayToast({ type: "warning", message: "Kindly select file/s first!" }));
                        }
                    }}>Send</button>
                </div>
            }
            {
                step == 2 &&
                <div className="mt-20 lg:mt-0 w-full flex flex-col items-center justify-center">
                    <video ref={videoRef} src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4" className="lg:w-[500px] object-cover object-center animate-pulse" loop />
                    <div className="absolute flex flex-col items-center gap-8 h-full justify-around">
                        <div className="flex flex-col items-center gap-8 mt-16">
                            <p className="text-4xl lg:text-6xl font-bold">File/s Access Code:</p>
                            <div className="flex gap-4 items-center w-fit text-white-light text-3xl lg:text-5xl">
                                <p style={{ letterSpacing: "10px" }} className="min-w-52 lg:min-w-72 font-['Orbitron'] text-white">{showAccessCode ? accessCode : `${accessCode.at(0)}****${accessCode.at(-1)}`}</p>
                                <button onClick={() => { setShowAccessCode(prev => !prev); }}>
                                    {showAccessCode ? <FaEye /> : <FaEyeSlash />}
                                </button>
                                <button onClick={() => {
                                    navigator.clipboard.writeText(accessCode);
                                    dispatch(displayToast({ message: "Copied Successfully !" }));
                                }} className="hover:bg-white hover:bg-opacity-30 p-3 rounded-full"><MdContentCopy /></button>
                            </div>
                        </div>
                        <p className="px-2 text-center font-light text-xl lg:text-2xl text-white-light"><span className="underline">Note</span>: Do not close this page if you do, you will not be able to share file/s anymore.</p>
                    </div>
                </div>
            }
        </>
    );
}