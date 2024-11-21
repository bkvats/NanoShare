import React, { useEffect } from "react";
import io from "socket.io-client";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Playground() {
    return (
        <section>
            <div className="flex justify-center gap-4 text-2xl font-light px-2 min-h-14">
                <NavLink to={"/send"} className={({ isActive }) => `w-full lg:w-1/3 ${isActive && "border-light border-t-0 font-medium"} p-2 text-center`}>
                    Send
                </NavLink>
                <NavLink to={"/receive"} className={({ isActive }) => `w-full lg:w-1/3 ${isActive && "border-light border-t-0 font-medium"} p-2 text-center`}>
                    Receive
                </NavLink>
            </div>
            <div className="mt-8 relative">
                <div className="z-10 w-full">
                    <Outlet />
                </div>
            </div>
        </section>
    );
}