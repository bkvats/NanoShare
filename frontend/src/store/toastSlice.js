import {createSlice} from "@reduxjs/toolkit";

export const toastSlice = createSlice({
    name: "toast",
    initialState: {
        showToast: false,
        type: "success",
        message: "Success",
        duration: 3000
    },
    reducers: {
        setShowToast: (state, action) => {
            state.showToast = action.payload;
        },
        setToastDetails: (state, action) => {
            state.type = action.payload?.type || "success";
            state.message = action.payload?.message || "Success";
            state.duration = action.payload?.duration || 3000;
        }
    }
});
export const {setShowToast, setToastDetails} = toastSlice.actions;