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

    const startConnection = () => {

        dispatch(displayLoader("Verifying Code..."));

        let senderSocketId = "";

        socket.emit("check-code", code.join(""), (response) => {

            if (!response.success) {

                dispatch(setIsLoading(false));

                if (response.statusCode === 404)
                    dispatch(displayToast({ message: "Invalid Access Code!", type: "error" }));

                else
                    dispatch(displayToast({ message: response.message, type: "warning" }));

                return;
            }

            dispatch(displayLoader("Connecting to sender..."));

            senderSocketId = response.data.socketId;

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            let pendingCandidates = [];
            let remoteDescriptionSet = false;

            socket.on("sdp-offer", async (offer) => {

                try {

                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    remoteDescriptionSet = true;

                    pendingCandidates.forEach(c =>
                        pc.addIceCandidate(new RTCIceCandidate(c))
                    );

                    pendingCandidates = [];

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    socket.emit("sdp-answer", {
                        answer: pc.localDescription,
                        senderSocketId,
                        receiverSocketId: socket.id
                    });

                } catch (err) {
                    console.error("Offer error:", err);
                }

            });

            socket.on("ice-candidate", async ({ candidate }) => {

                try {

                    if (remoteDescriptionSet)
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));

                    else
                        pendingCandidates.push(candidate);

                } catch (err) {
                    console.error("ICE error:", err);
                }

            });

            pc.onicecandidate = (event) => {

                if (event.candidate) {

                    socket.emit("ice-candidate", {
                        candidate: event.candidate,
                        anotherEndSocketId: senderSocketId,
                        receiverSocketId: socket.id
                    });

                }

            };

            socket.emit("setupNewConnection", {
                senderSocketId,
                receiverSocketId: socket.id
            });

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
                            setStep(2);

                        }

                    } else {

                        const file = fastFiles[i];

                        if (!file.startTime)
                            file.startTime = Date.now();

                        const chunkData = event.data;

                        file.chunks.push(chunkData);
                        file.received += chunkData.byteLength;

                        setFileReceivedSize(prev => {

                            const newSize = prev + chunkData.byteLength;

                            setReceivedPercentage((newSize * 100) / file.filesize);

                            const speed = newSize / ((Date.now() - file.startTime) / 1000);

                            setTransferSpeed(speed);
                            setTimeLeft((file.filesize - newSize) / speed);

                            return newSize;

                        });

                        if (file.received === file.filesize) {

                            const blob = new Blob(file.chunks, { type: file.filetype });

                            const url = URL.createObjectURL(blob);

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `NanoShare_${file.filename}`;
                            a.click();

                            fastFiles[i].status = "completed";
                            fastFiles[i].downloadUrl = url;

                            i++;

                            if (i < fastFiles.length)
                                fastFiles[i].status = "active";

                            setFiles([...fastFiles]);

                            setFileReceivedSize(0);
                            setReceivedPercentage(0);
                            setTransferSpeed(0);
                            setTimeLeft(0);

                            if (i < fastFiles.length) {

                                setTimeout(() => {

                                    dataChannel.send(
                                        encodeJson("send-file", i)
                                    );

                                }, 2000);

                            } else {

                                videoRef.current.pause();

                            }

                        }

                    }

                };

            };

        });

    };

    return (
        <>
            {step === 1 &&
                <div>

                    <p className="text-center text-4xl font-light my-10">
                        Enter Access Key
                    </p>

                    <div className="w-full lg:w-1/2 flex justify-center gap-2 mx-auto">

                        {code.map((i, index) => (
                            <GoDotFill
                                key={index}
                                className={`text-5xl ${i === -1 ? "text-gray-600" : "text-white scale-110"} transition`}
                            />
                        ))}

                    </div>

                    <div className="py-10 text-4xl mx-auto grid grid-cols-3 w-fit gap-6 lg:gap-8">

                        {"123456789".split("").map((number) => (

                            <button
                                key={number}
                                className="px-4 py-2"
                                onClick={() => {

                                    const newArray = [];
                                    let found = false;

                                    for (let i = 0; i < 6; i++) {

                                        if (found || code[i] !== -1)
                                            newArray.push(code[i]);

                                        else {

                                            newArray.push(Number(number));
                                            found = true;

                                        }

                                    }

                                    setCode(newArray);

                                }}
                            >
                                {number}
                            </button>

                        ))}

                        <button
                            onClick={() => {

                                const newArray = [...code];
                                let found = false;

                                for (let i = 5; i >= 0; i--) {

                                    if (found || code[i] === -1) continue;

                                    newArray[i] = -1;
                                    found = true;

                                }

                                setCode(newArray);

                            }}
                        >
                            <MdOutlineBackspace />
                        </button>

                        <button
                            onClick={() => {

                                const newArray = [];
                                let found = false;

                                for (let i = 0; i < 6; i++) {

                                    if (found || code[i] !== -1)
                                        newArray.push(code[i]);

                                    else {

                                        newArray.push(0);
                                        found = true;

                                    }

                                }

                                setCode(newArray);

                            }}
                        >
                            0
                        </button>

                        <button
                            onClick={() => {

                                if (code.includes(-1)) {

                                    dispatch(displayToast({
                                        message: "Enter access code first!",
                                        type: "error"
                                    }));

                                    return;
                                }

                                startConnection();

                            }}
                        >
                            <GoArrowRight />
                        </button>

                    </div>

                </div>
            }

            {step === 2 &&
                <div className="flex flex-col items-center">

                    <p className="text-2xl my-8 text-white-light font-light">
                        Total <span className="text-white font-black">{files.length} file/s</span> of
                        <span className="text-white font-black">
                            {sizeConverter(files.map(i => i.filesize).reduce((a, b) => a + b))}
                        </span>
                    </p>

                    <button
                        className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10"
                        onClick={() => {

                            controlChannel.send(encodeJson("send-file", 0));
                            setStep(3);

                        }}
                    >
                        Receive
                    </button>

                </div>
            }

            {step === 3 &&
                <div className="flex justify-center">

                    <div className="fixed bottom-0">
                        <video
                            style={{ height: "calc(100vh - 8.5rem)" }}
                            ref={videoRef}
                            src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4"
                            className="object-cover object-center"
                            autoPlay
                            loop
                        />
                    </div>

                    <div className="border-0 overflow-auto w-[97%] lg:w-1/2">

                        {files.map((file) => (
                            <SimpleProgressCard
                                {...file}
                                key={file.filename}
                                status={file.status}
                                speed={transferSpeed}
                                timeLeft={timeLeft}
                                receivedSize={fileReceivedSize}
                                receivedPercentage={receivedpercentage}
                                downloadurl={file.downloadUrl}
                            />
                        ))}

                    </div>

                </div>
            }

        </>
    );
}
