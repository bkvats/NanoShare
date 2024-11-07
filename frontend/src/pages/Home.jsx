import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { PiUploadLight } from "react-icons/pi";
import { MdOutlinePassword } from "react-icons/md";
import { MdOutlineDevices } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { SiFiles } from "react-icons/si";
export default function Home() {
    const stepsCard = [
        {
            icon: <PiUploadLight size={"1rem"} />,
            title: "Upload file",
            heading: "From your device to anywhere !",
            subHeading: "Just drop your file here and let the magic begin.",
            imgUrl: "drop-file.png"
        },
        {
            icon: <MdOutlinePassword size={"1rem"} />,
            title: "Get the code",
            heading: "A unique code will be generated.",
            subHeading: "This unique 6 digits code will help you at other end to recieve the file.",
            imgUrl: "lock.png"
        },
        {
            icon: <MdOutlineDevices size={"1rem"} />,
            title: "Use code",
            heading: "Open NanoShare on another device and enter unique code.",
            subHeading: "The 6 digits code will be verified and then the file will ready to sent.",
            imgUrl: "unlock.png"
        },
        {
            icon: <AiFillThunderbolt size={"1rem"} />,
            title: "Get file",
            heading: "Recieve the file with lighting fast speed.",
            subHeading: "Downloading will be get started and you will get the file on another device easily.",
            imgUrl: "get-file.png"
        }
    ]
    return (
        <>
            <div className="lg:mt-2 flex justify-center md:items-center border-light border-t-0 border-l-0 border-r-0">
                <div className="absolute lg:w-[70%] z-10 flex flex-col mt-32 lg:mt-0 items-center gap-4">
                    <h1 className="font-bold text-6xl text-center">Share files anywhere easily!</h1>
                    <span className="text-white-light w-3/4 text-center text-lg">You can now share your files directly from your device to anywhere. It's safe, peer-to-peer and your data does'nt even gets stored on servers.</span>
                    <div className="flex gap-4 text-sm lg:text-xl mt-8">
                        <button className="relative pl-9 pr-4 py-2 bg-white border border-black text-black rounded-full hover:bg-gray-300 transition hover:scale-110"><IoTriangleSharp className="absolute left-2 lg:top-[10px]" size={"20px"} />Send a file</button>
                        <button className="relative pl-9 pr-4 py-2 bg-black border text-white rounded-full hover:bg-gray-900 transition hover:scale-110"><IoTriangleSharp className="absolute left-3 lg:top-[12px] rotate-180" size={"18px"} />Recieve a file</button>
                    </div>
                </div>
                <video src="src/pages/images/space-bg.mp4" style={{ height: `calc(100vh - 3.5rem)`, width: "100%" }} className="object-cover object-center" autoPlay muted loop>
                </video>
            </div>
            <div className="flex flex-col items-center justify-center w-full py-10">
                <div className="text-2xl lg:text-3xl font-medium flex gap-2 flex-wrap justify-center items-center">
                    Share your <span className="flex items-center gap-2 text-white-light font-light border-light py-2 px-4 rounded-full text-lg"><SiFiles /> Files</span> without compromising <span className="flex items-center gap-2 text-md text-white-light font-light border-light py-2 px-4 rounded-full text-lg"><MdOutlineSecurity /> Security</span>
                </div>
                    <img src="src/pages/images/line.gif" alt="" className="w-[90%] mt-2 lg:w-auto"/>
            </div>
            <div className="lg:grid grid-cols-2 mx-auto lg:w-[80%]">
                {
                    stepsCard.map((i) => (
                        <div className="lg:border border-white border-opacity-20 p-8 pb-2">
                            <span className="flex gap-2 items-center text-white-light">
                                {i.icon}
                                {i.title}
                            </span>
                            <div className="my-3 text-2xl">
                                <p className="font-semibold">{i.heading}</p>
                                <p className="text-white-light">{i.subHeading}</p>
                            </div>
                            <img src={`src/pages/images/${i.imgUrl}`} alt="" width={250} className="mx-auto pointer-events-none" />
                        </div>
                    ))
                }
            </div>
            {/* <div className="mt-4">
                <p className="text-2xl font-bold">Ready to Share? </p>
                <div className="flex flex-col items-start gap-2 mt-4 pb-4">
                    <button className="relative pl-9 pr-4 py-2 bg-white border border-black text-black rounded-full hover:bg-gray-300 transition"><IoTriangleSharp className="absolute left-2 top-[10px]" size={"20px"} />Send a file</button>
                    <button className="relative pl-9 pr-4 py-2 bg-black border text-white rounded-full hover:bg-gray-900 transition"><IoTriangleSharp className="absolute left-3 top-[12px] rotate-180" size={"18px"} />Recieve a file</button>
                </div>
            </div > */}
        </>
    )
}