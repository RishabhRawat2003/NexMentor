import { configureStore } from '@reduxjs/toolkit'
import mentorSlice from './MentorSlice.js'
import dataSlice from './ParamsSlice.js'
import sidebarSlice from './SidebarSlice.js'

const store = configureStore({
    reducer: {
        mentor: mentorSlice.reducer,
        data: dataSlice.reducer,
        sidebarSlice: sidebarSlice.reducer
    }
})

export default store