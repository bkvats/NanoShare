import { NavLink } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { BiGlobe } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiGeeksforgeeks } from "react-icons/si";
import { IoIosOptions } from "react-icons/io";
import { useEffect, useState } from "react";
export default function Header() {
    const [showSideBar, setShowSideBar] = useState(false);
    const navLink = [
        {
            name: "Contact",
            to: "/contact"
        },
        {
            name: "About",
            to: "/about"
        },
        {
            name: "Privacy",
            to: "/privacy"
        },
        {
            name: "FAQs",
            to: "/faqs"
        }
    ];
    const links = [
        {
            href: "https://bsharma.vercel.app",
            icon: <BiGlobe className="hover:scale-110" />
        },
        {
            href: "https://x.com/BSharma10111",
            icon: <FaXTwitter className="hover:scale-110" />
        },
        {
            href: "https://www.linkedin.com/in/bhupender-kumar-sharma-2a144a2a7/",
            icon: <FaLinkedin className="hover:scale-110" />
        },
        {
            href: "https://github.com/bkvats",
            icon: <FaGithub className="hover:scale-110" />
        },
        {
            href: "https://leetcode.com/u/bkvats/",
            icon: <SiLeetcode className="hover:scale-110" />
        },
        {
            href: "https://www.geeksforgeeks.org/user/bkvatsnx6l/",
            icon: <SiGeeksforgeeks className="hover:scale-110" />
        },
    ];
    useEffect(() => {
        if (showSideBar) {
            document.body.style.overflow = "hidden";
        }
        else document.body.style.overflow = "auto";
    }, [showSideBar]);
    return (
        <>
            <header className="absolute top-0 hidden min-h-14 z-50 bg-[#00000000] lg:flex w-full items-center py-2 justify-between px-16">
                <div className="flex items-center gap-2">
                    <NavLink to={"/"} className={"flex items-center gap-1 mx-4"}>
                        <img src="https://res.cloudinary.com/duhmeadz6/image/upload/v1731116089/logo_hdf34r.png" alt="" width={30} />
                        <span className="text-2xl font-bold">
                            NanoShare
                        </span>
                    </NavLink>
                    <nav>
                        <ul className="flex gap-8 mx-4 text-white-light font-light text-md items-center h-6">
                            {
                                navLink.map((i) => (
                                    <NavLink key={i.to} to={i.to} className={({ isActive }) => `${isActive && "border-b-2 pb-1"} hover:border-b-2 hover:pb-1`}>{i.name}</NavLink>
                                ))
                            }
                        </ul>
                    </nav>
                </div>
                <button className="bg-white text-black rounded-full text-sm py-2 px-3 font-normal hover:bg-opacity-90">Transfer now</button>
            </header>
            <header className={`min-h-20 ${showSideBar && "bg-black"} absolute top-0 w-full flex items-center justify-between lg:hidden z-50`}>
                <NavLink to={"/"} className={"flex items-center gap-1 mx-4"}>
                    <img src="https://res.cloudinary.com/duhmeadz6/image/upload/v1731116089/logo_hdf34r.png" alt="" width={30} />
                    <span className="text-2xl font-bold">
                        NanoShare
                    </span>
                </NavLink>
                {
                    showSideBar ?
                        <button onClick={() => {
                            setShowSideBar(false);
                        }}>
                            <IoMdCloseCircleOutline size={"2.5rem"} className="text-white-light mx-4" />
                        </button>
                        :
                        <button onClick={() => {
                            setShowSideBar(true);
                        }}>
                            <IoIosOptions className="text-white-light mx-4" size={"2rem"} />
                        </button>
                }
                <div className={`${showSideBar ? "scale-100" : "scale-0"} bg-black absolute flex flex-col items-center justify-around top-16 z-50 transition-transform origin-top`} style={{ height: `calc(100vh - 5rem)`, minWidth: "100vw" }}>
                    <nav>
                        <ul className="flex flex-col gap-10 mx-4 mt-2 text-lg items-center">
                            {
                                navLink.map((i) => (
                                    <NavLink key={i.to} to={i.to} className={({ isActive }) => `${isActive && "border-b-2 pb-1"} hover:border-b-2 hover:pb-1`}>{i.name}</NavLink>
                                ))
                            }
                        </ul>
                        <button className="bg-white text-black rounded-full text-lg py-2 px-4 font-normal my-10">Transfer now</button>
                    </nav>
                    <div className="text-xl py-2 px-16 border-light border-b-0 border-l-0 border-r-0 flex flex-col justify-center items-center gap-2 mb-10">
                        <div className="flex gap-2 items-center flex-wrap justify-center">
                            <span className="text-white-light flex gap-2 items-center">
                                Handcrafted with <span className="text-white"><FaHeartCircleBolt /></span> by
                            </span>
                            <span className="font-bold">
                                Bhupender Kr. Sharma
                            </span>
                            <span className="text-sm text-white-light">
                                © Copyright 2024
                            </span>
                        </div>
                        <div className="flex gap-4 items-center lg:mb-0">
                            {
                                links.map((i) => (
                                    <a href={i.href} target="_blank" className="text-2xl" key={i.href}>{i.icon}</a>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}