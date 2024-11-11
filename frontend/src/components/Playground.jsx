import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function Playground() {
    return (
        <section className="mt-10">
            <div className="flex justify-center gap-4 text-2xl font-light px-2">
                <NavLink to={"/send"} className={({ isActive }) => `w-full lg:w-1/3 ${isActive && "border-light border-t-0 font-medium"} p-2 text-center`}>
                    Send
                </NavLink>
                <NavLink to={"/receive"} className={({ isActive }) => `w-full lg:w-1/3 ${isActive && "border-light border-t-0 font-medium"} p-2 text-center`}>
                    Receive
                </NavLink>
            </div>
            <div className="mt-8 relative">
                {/* <video src="https://hrcdn.net/fcore/assets/onboarding/globe-5fdfa9a0f4.mp4" autoPlay={false} loop muted className="w-full h-[600px]"></video> */}
                <div className="z-10 w-full">
                    <Outlet />
                </div>
            </div>
        </section>
    );
}