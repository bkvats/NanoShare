import React from "react";
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

export default function FileIcon({ filename, filetype }) {
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
    function getFileIcon(filename, filetype) {
        if (fileIcons.has(filetype.split("/")[0])) return fileIcons.get(filetype.split("/")[0]);
        if (fileIcons.has(filename.split(".").at(-1))) return fileIcons.get(filename.split(".").at(-1));
        return fileIcons.get("other");
    }
    return (
        <>
            {getFileIcon(filename, filetype)}
        </>
    )
}