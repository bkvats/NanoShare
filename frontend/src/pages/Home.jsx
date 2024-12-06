import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { PiUploadLight } from "react-icons/pi";
import { MdOutlinePassword } from "react-icons/md";
import { MdOutlineDevices } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { SiFiles } from "react-icons/si";
import { NavLink } from "react-router-dom";
export default function Home() {
    const stepsCard = [
        {
            icon: <PiUploadLight size={"1rem"} />,
            title: "Upload file",
            heading: "From your device to anywhere!",
            subHeading: "Just drop your file here and let the magic begin.",
            imgUrl: "https://res.cloudinary.com/duhmeadz6/image/upload/v1731116184/drop-file_tmdctp.png",
            border: "border-r border-b"
        },
        {
            icon: <MdOutlinePassword size={"1rem"} />,
            title: "Get the code",
            heading: "A unique code will be generated.",
            subHeading: "This unique 6 digits code will help you at other end to receive the file.",
            imgUrl: "https://res.cloudinary.com/duhmeadz6/image/upload/v1731116178/lock_xd6bza.png",
            border: "border-b"
        },
        {
            icon: <MdOutlineDevices size={"1rem"} />,
            title: "Use code",
            heading: "Open NanoShare on another device and enter unique code.",
            subHeading: "The 6 digits code will be verified and then the file will ready to sent.",
            imgUrl: "https://res.cloudinary.com/duhmeadz6/image/upload/v1731116177/unlock_fch2fi.png",
            border: "border-r"
        },
        {
            icon: <AiFillThunderbolt size={"1rem"} />,
            title: "Get file",
            heading: "Receive the file with lighting fast speed.",
            subHeading: "Downloading will be get started and you will get the file on another device easily.",
            imgUrl: "https://res.cloudinary.com/duhmeadz6/image/upload/v1731116178/get-file_ojonlm.png",
            border: ""
        }
    ]
    return (
        <>
            <div className="flex justify-center md:items-center border-light border-t-0 border-l-0 border-r-0">
                <div className="absolute lg:w-[70%] z-10 flex flex-col mt-32 lg:mt-0 lg:mb-12 items-center gap-4">
                    <h1 className="font-bold text-6xl text-center">Share files anywhere easily!</h1>
                    <span className="text-white-light w-3/4 text-center text-lg">You can now share your files directly from your device to anywhere. It's safe, peer-to-peer and your data does'nt even gets stored on servers.</span>
                    <div className="flex gap-4 text-sm lg:text-xl mt-8">
                        <NavLink to={"/send"} className="relative pl-9 pr-4 py-2 bg-white border border-black text-black rounded-full transition hover:scale-110"><IoTriangleSharp className="absolute left-2 lg:top-[10px]" size={"20px"} />Send a file</NavLink>
                        <NavLink to={"/receive"} className="relative pl-9 pr-4 py-2 bg-black border text-white rounded-full  transition hover:scale-110"><IoTriangleSharp className="absolute left-3 lg:top-[12px] rotate-180" size={"18px"} />Receive a file</NavLink>
                    </div>
                </div>
                <video src="https://res.cloudinary.com/duhmeadz6/video/upload/v1731116359/space-bg_l1ktlq.mp4" className="h-screen min-w-full object-cover object-center" autoPlay muted loop />
            </div>
            <div className="flex flex-col items-center justify-center w-full py-10">
                <div className="text-2xl lg:text-3xl font-medium flex gap-2 flex-wrap justify-center items-center border-b border-opacity-20 border-white pb-4">
                    Share your <span className="flex items-center gap-2 text-white-light font-light border-light py-2 px-4 rounded-full text-lg"><SiFiles /> Files</span> without compromising <span className="flex items-center gap-2 text-md text-white-light font-light border-light py-2 px-4 rounded-full text-lg"><MdOutlineSecurity /> Security</span>
                </div>
            </div>
            <div className="lg:grid grid-cols-2 mx-auto lg:w-[80%]">
                {
                    stepsCard.map((i) => (
                        <div key={i.title} className={`border-white border-opacity-0 lg:border-opacity-20 ${i.border} p-8 pb-2`}>
                            <span className="flex gap-2 items-center text-white-light">
                                {i.icon}
                                {i.title}
                            </span>
                            <div className="my-3 text-2xl">
                                <p className="font-semibold">{i.heading}</p>
                                <p className="text-white-light">{i.subHeading}</p>
                            </div>
                            <img src={i.imgUrl} alt="" width={250} className="mx-auto pointer-events-none" />
                        </div>
                    ))
                }
            </div>
        </>
    )
}