import React from "react";
import { useSelector } from "react-redux";

export default function Loader() {
    const {isLoading, loadingMessage} = useSelector(state => state.loader);
    return (
        <>
            <div className="bg-white bg-opacity-15 min-h-screen w-full fixed top-0 z-50 animate-pulse" hidden = {!isLoading}>
            </div>
            <div className={`fixed top-0 ${isLoading ? "translate-y-10" : "-translate-y-16"} py-2 px-3 z-50 left-6 lg:left-[35%] w-[90%] lg:w-[35%] h-14 flex items-center bg-black gap-4 rounded-2xl text-xl font-bold transition duration-300 origin-top "`}>
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin-slow"></div>
                <span>{loadingMessage}</span>
            </div>
        </>
    );
}