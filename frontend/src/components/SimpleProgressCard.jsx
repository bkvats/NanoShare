import React from "react";
import { IoIosPause } from "react-icons/io";
import { MdAudiotrack } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function SimpleProgressCard() {
    // filename, fileIcon, fileTotalSize, fileCurrentSize, speed, time left
    return (
        <div className="w-[97%] lg:w-1/2 mx-auto flex items-center gap-10 p-4 rounded-lg border-light relative">
            <button className="absolute top-1 text-xl right-2 hover:bg-white hover:bg-opacity-30 p-1 rounded-full transition"><IoMdClose /></button>
            <div className="text-5xl">
                <MdAudiotrack />
            </div>
            <div className="w-full">
                <span className="line-clamp-2 mt-3 mb-1 text-lg">Lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ipsa cupiditate id iusto mollitia eum quaerat adipisci harum aspernatur provident! Ab facilis rem aliquam, dignissimos sint impedit. Dolorem, quae eaque. dolor sit deserunt repellat?</span>
                <p className="text-white-light">434 KB/s - 3.8 MB of 2.9 GB,</p>
                <p className="text-white-light mt-1">2 hours left</p>
                <div className="w-full h-1 bg-gray-500 mt-6 mb-10">
                    <div className="scale-x-[50%] h-1 bg-blue-500 transition origin-left"></div>
                </div>
                <button className="absolute bottom-2 text-2xl left-24 hover:bg-white hover:bg-opacity-30 p-1 rounded-full transition"><IoIosPause /></button>
                <button className="absolute bottom-2 right-6 text-2xl hover:bg-white hover:bg-opacity-30 p-1 rounded-full transition"><MdKeyboardArrowDown /></button>
            </div>
        </div>
    )
}