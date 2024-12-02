import { configureStore } from '@reduxjs/toolkit'
import mentorSlice from './MentorSlice.js'
import dataSlice from './ParamsSlice.js'
import sidebarSlice from './SidebarSlice.js'
import headerReducer from './HeaderSlice.js'

const store = configureStore({
    reducer: {
        mentor: mentorSlice.reducer,
        data: dataSlice.reducer,
        sidebarSlice: sidebarSlice.reducer,
        header: headerReducer
    }
})

export default store