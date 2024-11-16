import React from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/loaderSlice";
export default function Contact() {
    const dispatch = useDispatch();
    return (
        <div>
            This is contact page
            <button onClick={() => {
                dispatch(setIsLoading(true))
            }}>Hide Loader</button>
            <button onClick={() => {
                dispatch(setIsLoading(false))
            }}>Show Loader</button>
        </div>
    );
}