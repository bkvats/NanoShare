import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
export default function Home() {
    return (
        <>
            <div className="relative border-2 h-[600px] flex flex-col items-center">
                <div className="absolute w-[60%] z-10 top-20 flex flex-col items-center gap-6">
                    <h1 className="font-bold text-5xl text-center">Share files anywhere easily!</h1>
                    <span className="text-white-light w-3/4 text-center">You can now share your files directly from your device to anywhere. It's safe, peer-to-peer and your data does'nt even gets stored on servers.</span>
                    <div className="flex gap-2">
                        <button className="relative pl-9 pr-4 py-2 bg-white border border-black text-black rounded-full hover:bg-gray-300 transition"><IoTriangleSharp className="absolute left-2 top-[10px]" size={"20px"} />Send a file</button>
                        <button className="relative pl-9 pr-4 py-2 bg-black border text-white rounded-full hover:bg-gray-900 transition"><IoTriangleSharp className="absolute left-2 top-[12px] rotate-180" size={"18px"} />Recieve a file</button>
                    </div>
                </div>
                <div className="absolute top-0 pointer-events-none border-[0.009px] border-opacity-10" >
                    <img src="src/pages/images/rainbow.png" alt="rainbow-design" width={1000} />
                </div>
            </div>
            <div>
            </div>
        </>
    )
}