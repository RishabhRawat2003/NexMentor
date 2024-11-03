import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginParam: ''
};

const dataSlice = createSlice({
    name: "data",
    initialState: initialState,
    reducers: {
        setLoginParam: (state, action) => {
            state.loginParam = action.payload;
        }

    }
});

export const { setLoginParam } = dataSlice.actions;

export default dataSlice;
