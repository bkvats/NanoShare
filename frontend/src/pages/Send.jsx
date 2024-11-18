import React, { useRef, useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { CiSquarePlus } from "react-icons/ci";
import FileIcon from "../components/FileIcon";
import { FaEye, } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useDispatch } from "react-redux";
import { displayToast } from "../store/toastSlice";
import getSocket from "../socket";
import ToggleButton from "../components/ToggleButton";
import { displayLoader, setIsLoading } from "../store/loaderSlice";
import sizeConverter from "../utils/sizeConverter";

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
    // const fileIcons = new Map([
    //     ["image", <CiImageOn />],
    //     ["video", <LuClapperboard />],
    //     ["audio", <MdAudiotrack />],
    //     ["pdf", <FaRegFilePdf />],
    //     ["docx", <PiMicrosoftWordLogoFill />],
    //     ["zip", <FaFileZipper />],
    //     ["pptx", <SiMicrosoftpowerpoint />],
    //     ["xlsx", <SiMicrosoftexcel />],
    //     ["txt", <GrDocumentTxt />],
    //     ["py", <FaPython />],
    //     ["java", <FaJava />],
    //     ["cpp", <TbBrandCpp />],
    //     ["c", <SiVisualstudiocode />],
    //     ["html", <FaHtml5 />],
    //     ["css", <FaCss3 />],
    //     ["js", <DiJsBadge />],
    //     ["ts", <SiTypescript />],
    //     ["exe", <BsFiletypeExe />],
    //     ["json", <LuFileJson2 />],
    //     ["other", <CiFileOn />]
    // ]);

    // function getFileIcon(file) {
    //     if (fileIcons.has(file.type.split("/")[0])) return fileIcons.get(file.type.split("/")[0]);
    //     if (fileIcons.has(file.name.split(".").at(-1))) return fileIcons.get(file.name.split(".").at(-1));
    //     return fileIcons.get("other");
    // }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("socket connected in send page", socket.id);
        });
    }, [step]);
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
                                    console.log(receiverSocketId, "trying to setup a new connection..");
                                    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                                    peerConnections.set(receiverSocketId, pc);
                                    iceCandidates.set(receiverSocketId, []);
                                    remoteDescriptionSet.set(receiverSocketId, false);
                                    const dataChannels = [];
                                    const messageChannel = pc.createDataChannel("messageTransfer");
                                    for (let i = 0; i < 10; i++) {
                                        dataChannels.push(pc.createDataChannel("fileTransfer" + i));
                                    }
                                    dataChannels.forEach((dc, index) => {
                                        dc.onopen = () => {
                                            console.log(`Data Channel ${index} is open to send files`);
                                        }
                                        dc.onclose = () => {
                                            console.log(`Data Channel ${index} is closed and not sending fiels anymore`);
                                        }
                                    });
                                    // let i = 0;
                                    function sendFile(file) {
                                        function sendNextChunk() {
                                            if (offset < file.size) {
                                                const slice = file.slice(offset, offset + chunkSize);
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    dataChannels[i].send(event.target.result);
                                                    console.log("Sent file chunk of size:", event.target.result.byteLength);
                                                    i = (i + 1) % 10;
                                                    sendNextChunk();
                                                }
                                                reader.readAsArrayBuffer(slice);
                                                offset += chunkSize;
                                            }
                                            else {
                                                messageChannel.send(JSON.stringify({type: "response", EOF: true}));
                                                console.log("file sent succesfully");
                                            }
                                        }
                                        videoRef.current.play();
                                        let i = 0;
                                        const chunkSize = 16 * 1024;
                                        let offset = 0;

                                        // files.forEach((file) => {
                                        //     console.log("-------------------\nSending file:", file.name, "\n---------------");
                                        //     let chunkSize = 16 * 1024;
                                        //     let offset = 0;
                                        //     messageChannel.send(JSON.stringify({ type: "fileInfo", fileType: file.type, fileName: file.name }));
                                        //     for (let i = 0; offset < file.size; i = (i + 1) % 10) {
                                        //         console.log("trying to send file");
                                        //         const slice = file.slice(offset, offset + chunkSize);
                                        //         const reader = new FileReader();
                                        //         reader.onload = (event) => {
                                        //             dataChannels[i].send(event.target.result);
                                        //             console.log("sent data of size:", event.target.result.byteLength);
                                        //         }
                                        //         reader.readAsArrayBuffer(slice);
                                        //         offset += chunkSize;
                                        //     }
                                        //     console.log(file.name + " file send successfully");
                                        // })
                                        sendNextChunk();
                                    }

                                    messageChannel.onopen = () => {
                                        console.log("The message channel is open at sender's page for messaging...");
                                        messageChannel.send(JSON.stringify({
                                            type: "dataInfo", infoOfFiles: files.map((file) => {
                                                return { filename: file.name, filetype: file.type, filesize: file.size }
                                            })
                                        }));
                                        messageChannel.onmessage = (event) => {
                                            const data = JSON.parse(event.data);
                                            if (data.type === "trigger" && data.startSending) {
                                                sendFile(files[0]);
                                            }
                                        }
                                    }
                                    messageChannel.onclose = () => {
                                        console.log("Message channel on sender's page is closed...");
                                    }

                                    // dataChannel.onopen = () => {
                                    //     console.log("Data channel is open to send files");
                                    //     if (!allowMultipleReceivers && peerConnections.size == 1) {
                                    //         console.log("sending block request to server");
                                    //         socket.emit("change-permission", { senderSocketId: socket.id, isSending: false });
                                    //     }


                                    // }
                                    // dataChannel.onclose = () => {
                                    //     console.log("Data channel is no more sending files");
                                    // }
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
                                    console.log("got sdp answer from receiver:", answer);
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
                                        console.log("ICE candidate received before setting remote description");
                                        iceCandidates.get(receiverSocketId).push(candidate);
                                    }
                                });
                            }
                            catch (error) {
                                dispatch(displayToast({ message: "Something went wrong please try again !", type: "error" }));
                                console.log("error is here", error);
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