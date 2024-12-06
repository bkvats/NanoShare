import React from "react";
import sizeConverter from "../utils/sizeConverter";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import FileIcon from "./FileIcon";
import timeConverter from "../utils/timeConverter";

export default function SimpleProgressCard({ status = "completed", filename, filetype, filesize, speed, timeLeft, receivedSize, receivedPercentage, downloadurl }) {
    return (
        <div className="w-full mx-auto my-4 flex gap-10 p-4 pt-0 rounded-2xl border-light relative bg-black bg-opacity-50">
            <div className="text-5xl mt-8">
                <FileIcon filename={filename} filetype={filetype} />
                {
                    status === "completed" ?
                    <button className="text-2xl mx-2 hover:bg-green-500 hover:bg-opacity-30 p-1 rounded-full transition cursor-default"><MdOutlineFileDownloadDone fill="green"/></button> :
                    <button className="text-2xl mx-2 hover:bg-red-500 hover:bg-opacity-30 p-1 rounded-full transition"><MdDeleteOutline fill="red" fillOpacity={"60%"} /></button>
                }
            </div>
            <div className="w-[75%] lg:w-full">
                <span className="line-clamp-1 lg:line-clamp-2 mt-3 mb-1 text-lg">{filename}</span>
                {
                    status === "waiting" ?
                        <div>
                            <p>{sizeConverter(filesize)}</p>
                            <span className="text-white-light animate-pulse">Waiting for download...</span>
                        </div>
                        :
                        status === "active" ?
                            <>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-white-light">{sizeConverter(speed)}/s - {sizeConverter(receivedSize)} of {sizeConverter(filesize)},</p>
                                    <p className="text-white-light">{timeConverter(timeLeft)} left</p>
                                </div>
                                <div className="w-full h-1 bg-gray-500 mt-6 mb-10">
                                    <div style={{ transform: `scaleX(${receivedPercentage}%)` }} className={`h-1 bg-blue-500 transition origin-left`}></div>
                                </div>
                            </>
                            :
                            <div className="my-4">
                                <p className="text-white-light mb-4">In case file does'nt save automatically click on the button to save</p>
                                <a href={downloadurl} download={`NanoShare_${filename}`} className="bg-white text-black rounded-full text-lg py-2 px-3 font-normal hover:scale-110 transition">Download</a>
                            </div>
                }
            </div>
        </div>
    )
}