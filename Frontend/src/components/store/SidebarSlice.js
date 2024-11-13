import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebar: false
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState: initialState,
    reducers: {
        setToggleSidebar: (state, action) => {
            state.sidebar = action.payload
        }

    }
});

export const { setToggleSidebar } = sidebarSlice.actions;

export default sidebarSlice;
