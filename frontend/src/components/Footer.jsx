import React from "react";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { BiGlobe } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiGeeksforgeeks } from "react-icons/si";
export default function Footer() {
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
    ]
    return (
        <footer className="text-xl w-full py-2 px-16 border-light min-h-24 flex flex-col justify-center items-center gap-2">
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
            <div className="flex gap-4 items-center mb-4 lg:mb-0">
                {
                    links.map((i) => (
                        <a href={i.href} target="_blank" className="text-2xl" key={i.href}>{i.icon}</a>
                    ))
                }
            </div>
        </footer>
    );
}