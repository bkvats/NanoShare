import React, { useRef, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { CiSquarePlus } from "react-icons/ci";
import { CiImageOn } from "react-icons/ci";
import { LuClapperboard } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { SiMicrosoftpowerpoint } from "react-icons/si";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentTxt } from "react-icons/gr";
import { MdAudiotrack } from "react-icons/md";
import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import { SiVisualstudiocode } from "react-icons/si";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { DiJsBadge } from "react-icons/di";
import { BsFiletypeExe } from "react-icons/bs";
import { FaFileZipper } from "react-icons/fa6";
import { SiTypescript } from "react-icons/si";
import { CiFileOn } from "react-icons/ci";
import { LuFileJson2 } from "react-icons/lu";
import { FaEye, } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setShowToast, setToastDetails} from "../store/toastSlice";

export default function Send() {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [step, setStep] = useState(1);
    const [accessCode, setAccessCode] = useState("854720");
    const [showAccessCode, setShowAccessCode] = useState(false);
    const dispatch = useDispatch();
    const fileIcons = new Map([
        ["image", <CiImageOn />],
        ["video", <LuClapperboard />],
        ["audio", <MdAudiotrack />],
        ["pdf", <FaRegFilePdf />],
        ["docx", <PiMicrosoftWordLogoFill />],
        ["zip", <FaFileZipper />],
        ["pptx", <SiMicrosoftpowerpoint />],
        ["xlsx", <SiMicrosoftexcel />],
        ["txt", <GrDocumentTxt />],
        ["py", <FaPython />],
        ["java", <FaJava />],
        ["cpp", <TbBrandCpp />],
        ["c", <SiVisualstudiocode />],
        ["html", <FaHtml5 />],
        ["css", <FaCss3 />],
        ["js", <DiJsBadge />],
        ["ts", <SiTypescript />],
        ["exe", <BsFiletypeExe />],
        ["json", <LuFileJson2 />],
        ["other", <CiFileOn />]
    ]);
    function getFileIcon(file) {
        if (fileIcons.has(file.type.split("/")[0])) return fileIcons.get(file.type.split("/")[0]);
        if (fileIcons.has(file.name.split(".").at(-1))) return fileIcons.get(file.name.split(".").at(-1));
        return fileIcons.get("other");
    }
    return (
        <>
            {
                step == 1 &&
                <div className="flex flex-col items-center px-4 lg:px-0">
                    {files.length == 0 ? <div className={`border-white border-dashed bg-black bg-opacity-70 border rounded-2xl text-2xl w-full lg:w-1/2 h-80 flex flex-col justify-center items-center gap-2 hover:bg-slate-900 transition cursor-pointer ${isDragging && "bg-slate-900"}`}
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
                        <div className={`border-white border-dashed bg-opacity-70 border rounded-2xl text-2xl w-full lg:w-1/2 h-80 p-4 flex flex-wrap overflow-y-auto gap-2 justify-evenly items-start ${isDragging && "bg-slate-900"}`}
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
                                                <span className="text-5xl self-center">{getFileIcon(file)}</span>
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
                    <button className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10 hover:scale-110 transition" onClick={() => {
                        if (files.length > 0) setStep(prev => prev + 1);
                        else {
                            dispatch(setToastDetails({type: "warning", message: "Kindly select file/s first!"}));
                            dispatch(setShowToast(true));
                        }
                    }}>Send</button>
                </div>
            }
            {
                step == 2 &&
                <div className="mt-20 lg:mt-0 w-full flex flex-col items-center justify-center">
                    <video src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4" className="lg:w-[500px] object-cover object-center animate-pulse" />
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
                                }} className="hover:bg-gray-700 p-3 rounded-full"><MdContentCopy /></button>
                            </div>
                        </div>
                        <p className="px-2 text-center font-light text-xl lg:text-2xl text-white-light"><span className="underline">Note</span>: Do not close this page if you do, you will not be able to share file/s anymore.</p>
                    </div>
                </div>
            }
        </>
    );
}