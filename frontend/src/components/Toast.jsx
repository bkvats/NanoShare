import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { IoWarning } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { setShowToast } from "../store/toastSlice";

export default function Toast() {
    const { showToast, type, message, duration } = useSelector(state => state.toast);
    const dispatch = useDispatch();
    const toastMap = new Map([
        ["success", [<MdOutlineDone size={"2rem"}/>, "bg-green-500"]],
        ["error", [<IoMdAlert size={"2rem"}/>, "bg-red-500"]],
        ["warning", [<IoWarning size={"2rem"}/>, "bg-yellow-500"]],
        ["info", [<FaCircleInfo size={"2rem"}/>, "bg-gray-500"]],
    ]);
    useEffect(() => {
        if (showToast) {
            setTimeout(() => {
                dispatch(setShowToast(false));
            }, duration)
        }
    }, [showToast]);
    return (
        <div className={`fixed top-10 py-2 px-3 z-50 left-6 lg:left-[35%] w-[90%] lg:w-[35%] h-14 rounded-xl ${toastMap.get(type)[1]} ${showToast ? "scale-100" : "scale-0"} flex items-center justify-between text-xl font-bold transition origin-top "`}>
            <div className="flex gap-4 items-center">
                {toastMap.get(type)[0]}
                <p className="line-clamp-2">{message}</p>
            </div>
            <button onClick={() => {dispatch(setShowToast(false))}} className="hover:bg-black hover:bg-opacity-30 p-1 rounded-full">
                <IoMdClose size={"1.4rem"}/>
            </button>
        </div>
    );
}