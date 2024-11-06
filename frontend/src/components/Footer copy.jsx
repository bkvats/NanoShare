import React from "react";
export default function Footer() {
    return (
        <footer className="mt-20">
            <hr className="border-[1px] border-[#ABB2BF]" />
            <div className="p-2 flex justify-around mt-5 mb-10 flex-wrap">
                <div>
                    <div className="flex gap-2">
                        <img src="/components/Footer/logo.svg" alt="logo" />
                        <p>Bhupender Kr. Sharma <span className="text-[#ABB2BF] mx-7">bkvats2394@gmail.com</span></p>
                    </div>
                    <p className="mt-3 font-light hidden lg:block">Software Developer and Engineer</p>
                </div>
                <div className="flex flex-col items-center mt-10 lg:mt-0">
                    <p className="font-semibold text-lg">Media</p>
                    <div className="flex gap-2 items-center">
                        <a href="https://x.com/BSharma10111" target="_blank"><img src="/components/Footer/x.svg" alt="xlogo" className="hover:rounded-full hover:bg-slate-700 p-2" /></a>
                        <a href="https://www.linkedin.com/in/bhupender-kumar-sharma-2a144a2a7/" target="_blank"><img src="/components/Footer/linkedin.svg" alt="" className="hover:rounded-full hover:bg-slate-700 p-2" /></a>
                        <a href="https://github.com/bkvats" target="_blank"><img src="/components/Footer/github.svg" alt="" className="hover:rounded-full hover:bg-slate-700 p-2"/></a>
                    </div>
                </div>
            </div>
            <div className="text-center text-[#ABB2BF] font-light mb-4">© Copyright 2024. Made by Bhupender</div>
        </footer>
    );
}