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

    const [code, setCode] = useState([-1,-1,-1,-1,-1,-1]);
    const [step,setStep] = useState(1);
    const [files,setFiles] = useState([]);
    const [controlChannel,setControlChannel] = useState(null);

    const [transferSpeed,setTransferSpeed] = useState(0);
    const [receivedpercentage,setReceivedPercentage] = useState(0);
    const [fileReceivedSize,setFileReceivedSize] = useState(0);
    const [timeLeft,setTimeLeft] = useState(0);

    const videoRef = useRef(null);
    const dispatch = useDispatch();

    const connectToSender = () => {

        dispatch(displayLoader("Verifying Code..."));

        socket.emit("check-code",code.join(""),(response)=>{

            if(!response.success){

                dispatch(setIsLoading(false));

                dispatch(displayToast({
                    message:"Invalid Access Code!",
                    type:"error"
                }));

                return;
            }

            dispatch(displayLoader("Connecting to sender..."));

            const senderSocketId = response.data.socketId;

            const pc = new RTCPeerConnection({
                iceServers:[{urls:"stun:stun.l.google.com:19302"}]
            });

            let pendingCandidates = [];
            let remoteDescSet = false;

            socket.off("sdp-offer");
            socket.off("ice-candidate");

            socket.on("sdp-offer",async(offer)=>{

                try{

                    await pc.setRemoteDescription(
                        new RTCSessionDescription(offer)
                    );

                    remoteDescSet = true;

                    for(const c of pendingCandidates){
                        await pc.addIceCandidate(new RTCIceCandidate(c));
                    }

                    pendingCandidates = [];

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    socket.emit("sdp-answer",{
                        answer:pc.localDescription,
                        senderSocketId,
                        receiverSocketId:socket.id
                    });

                }
                catch(e){
                    console.error(e);
                }

            });

            socket.on("ice-candidate",async({candidate})=>{

                try{

                    if(remoteDescSet)
                        await pc.addIceCandidate(
                            new RTCIceCandidate(candidate)
                        );
                    else
                        pendingCandidates.push(candidate);

                }
                catch(e){
                    console.error(e);
                }

            });

            pc.onicecandidate=(event)=>{

                if(event.candidate){

                    socket.emit("ice-candidate",{
                        candidate:event.candidate,
                        anotherEndSocketId:senderSocketId,
                        receiverSocketId:socket.id
                    });

                }

            };

            socket.emit("setupNewConnection",{
                senderSocketId,
                receiverSocketId:socket.id
            });

            let fastFiles=[];
            let i=0;

            pc.ondatachannel=(event)=>{

                const dataChannel = event.channel;
                dataChannel.binaryType="arraybuffer";

                setControlChannel(dataChannel);

                dataChannel.send(encodeJson("get-files"));

                dataChannel.onmessage=(event)=>{

                    if(typeof event.data==="string"){

                        const message = decodeJson(event.data);

                        if(message.type==="files"){

                            fastFiles=[...message.data];
                            setFiles(fastFiles);

                            dispatch(setIsLoading(false));
                            setStep(2);

                        }

                    }
                    else{

                        const file=fastFiles[i];

                        if(!file.startTime)
                            file.startTime=Date.now();

                        const chunk=event.data;

                        file.chunks.push(chunk);
                        file.received+=chunk.byteLength;

                        setFileReceivedSize(prev=>{

                            const newSize=prev+chunk.byteLength;

                            setReceivedPercentage(
                                (newSize*100)/file.filesize
                            );

                            const speed =
                                newSize/((Date.now()-file.startTime)/1000);

                            setTransferSpeed(speed);

                            setTimeLeft(
                                (file.filesize-newSize)/speed
                            );

                            return newSize;

                        });

                        if(file.received===file.filesize){

                            const blob=new Blob(
                                file.chunks,
                                {type:file.filetype}
                            );

                            const url=URL.createObjectURL(blob);

                            const a=document.createElement("a");
                            a.href=url;
                            a.download=`NanoShare_${file.filename}`;
                            a.click();

                            fastFiles[i].status="completed";
                            fastFiles[i].downloadUrl=url;

                            i++;

                            if(i<fastFiles.length)
                                fastFiles[i].status="active";

                            setFiles([...fastFiles]);

                            setFileReceivedSize(0);
                            setReceivedPercentage(0);
                            setTransferSpeed(0);
                            setTimeLeft(0);

                            if(i<fastFiles.length){

                                setTimeout(()=>{
                                    dataChannel.send(
                                        encodeJson("send-file",i)
                                    );
                                },1000);

                            }
                            else{
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
        {step===1 &&
        <div>

            <p className="text-center text-4xl font-light my-10">
                Enter Access Key
            </p>

            <div className="w-full lg:w-1/2 flex justify-center gap-2 mx-auto">
            {code.map((i,index)=>(
                <GoDotFill
                key={index}
                className={`text-5xl ${
                    i===-1?"text-gray-600":"text-white scale-110"
                }`}
                />
            ))}
            </div>

            <div className="py-10 text-4xl mx-auto grid grid-cols-3 w-fit gap-6">

            {"123456789".split("").map(n=>(
                <button
                key={n}
                onClick={()=>{
                    const arr=[...code];
                    const idx=arr.indexOf(-1);
                    if(idx!==-1){
                        arr[idx]=Number(n);
                        setCode(arr);
                    }
                }}>
                {n}
                </button>
            ))}

            <button onClick={()=>{
                const arr=[...code];
                for(let i=5;i>=0;i--){
                    if(arr[i]!==-1){
                        arr[i]=-1;
                        break;
                    }
                }
                setCode(arr);
            }}>
            <MdOutlineBackspace/>
            </button>

            <button onClick={()=>{
                if(code.includes(-1)){
                    dispatch(displayToast({
                        message:"Enter access code first!",
                        type:"error"
                    }));
                    return;
                }

                connectToSender();

            }}>
            <GoArrowRight/>
            </button>

            </div>

        </div>
        }

        {step===2 &&
        <div className="flex flex-col items-center">

            <p className="text-2xl my-8">
                {files.length} file/s
            </p>

            <button
            className="bg-white text-black px-6 py-2 rounded-full"
            onClick={()=>{
                controlChannel.send(
                    encodeJson("send-file",0)
                );
                setStep(3);
            }}>
            Receive
            </button>

        </div>
        }

        {step===3 &&
        <div className="flex justify-center">

            <div className="fixed bottom-0">
                <video
                style={{height:"calc(100vh - 8.5rem)"}}
                ref={videoRef}
                src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4"
                autoPlay
                loop
                />
            </div>

            <div className="w-[97%] lg:w-1/2">

            {files.map(file=>(
                <SimpleProgressCard
                key={file.filename}
                {...file}
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
