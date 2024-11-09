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

export default function Send() {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
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
                                        <button onClick={() => {
                                            setFiles(prev => prev.filter((_, currIndex) => currIndex != index))
                                        }} >
                                            <TfiClose color="red" className="absolute right-0 text-2xl z-10 hover:bg-[#ffffff2b] cursor-pointer rounded-full p-1" />
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
            <button className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10 hover:scale-110 transition">Send</button>
        </div>
    );
}