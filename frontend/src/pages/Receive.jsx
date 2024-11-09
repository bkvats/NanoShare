import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { MdOutlineBackspace } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";
export default function Receive() {
    const [code, setCode] = useState([-1, -1, -1, -1, -1, -1]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    return (
        <div>
            <p className="text-center text-4xl font-light my-10">Enter PIN</p>
            <div className="w-full lg:w-1/2 flex justify-center gap-2 mx-auto">
                {
                    code.map((i, index) => (
                        <GoDotFill key={index} className={`text-5xl ${i == -1 ? "text-gray-600" : "text-white scale-110"} transition`} />
                    ))
                }
            </div>
            <div className="mt-10 text-4xl mx-auto grid grid-cols-3 w-fit gap-6 lg:gap-8">
                {
                    "123456789".split("").map((number) => (
                        <button key={number} className="w-fit text-center mx-4 lg:hover:bg-gray-900 px-4 py-2 rounded-full transition duration-300" onClick={() => {
                            const newArray = [];
                            let found = false;
                            for (let i = 0; i < 6; i++) {
                                if (found || code[i] != -1) newArray.push(code[i]);
                                else if (code[i] == -1) {
                                    newArray.push(Number(number));
                                    found = true;
                                }
                            }
                            setCode(newArray);
                        }}>{number}</button>
                    ))
                }
                <button className="w-fit text-center mx-4 hover:bg-gray-900 rounded-full p-2 transition duration-300" onClick={() => {
                    const newArray = [...code];
                    let found = false;
                    for (let i = 5; i >= 0; i--) {
                        if (found || code[i] == -1) continue;
                        else if (code[i] != -1) {
                            newArray[i] = -1;
                            found = true;
                        }
                    }
                    setCode(newArray);
                }}><MdOutlineBackspace /></button>
                <button className="w-fit text-center mx-4 lg:hover:bg-gray-900 rounded-full px-4 py-2 transition duration-300" onClick={() => {
                    const newArray = [];
                    let found = false;
                    for (let i = 0; i < 6; i++) {
                        if (found || code[i] != -1) newArray.push(code[i]);
                        else if (code[i] == -1) {
                            newArray.push(0);
                            found = true;
                        }
                    }
                    setCode(newArray);
                }}>0</button>
                <button className="w-fit text-center mx-4 hover:bg-gray-900 rounded-full p-2 transition duration-300" onClick={() => {
                    console.log(code);
                }}><MdDoneAll /></button>
            </div>
        </div>
    );
}