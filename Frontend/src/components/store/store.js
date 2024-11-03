import { configureStore } from '@reduxjs/toolkit'
import mentorSlice from './MentorSlice.js'
import dataSlice from './ParamsSlice.js'

const store = configureStore({
    reducer: {
        mentor: mentorSlice.reducer,
        data: dataSlice.reducer
    }
})

export default store