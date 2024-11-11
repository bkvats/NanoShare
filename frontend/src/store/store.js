import { configureStore } from "@reduxjs/toolkit";
import { toastSlice } from "./toastSlice";

export const store = configureStore({
    reducer: {
        toast: toastSlice.reducer
    }
})