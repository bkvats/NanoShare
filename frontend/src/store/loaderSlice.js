import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
    name: "loader",
    initialState: {
        isLoading: false,
        loadingMessage: "Loading..."
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        displayLoader: (state, action) => {
            state.loadingMessage = action?.payload || "Please wait...";
            state.isLoading = true;
        }
    }
});

export const {setIsLoading, displayLoader} = loaderSlice.actions;