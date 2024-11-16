import { configureStore } from "@reduxjs/toolkit";
import { toastSlice } from "./toastSlice";
import { loaderSlice } from "./loaderSlice";

export const store = configureStore({
    reducer: {
        toast: toastSlice.reducer,
        loader: loaderSlice.reducer
    }
})