import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    updateKey: 0, // Triggers re-rendering
  },
  reducers: {
    triggerHeaderUpdate: (state) => {
      state.updateKey += 1; // Increment updateKey to signal a re-render
    },
  },
});

export const { triggerHeaderUpdate } = headerSlice.actions;

export default headerSlice.reducer;
