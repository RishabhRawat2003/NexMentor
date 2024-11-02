import { configureStore } from '@reduxjs/toolkit'
import mentorSlice from './MentorSlice.js'

const store = configureStore({
    reducer: {
        mentor: mentorSlice.reducer
    }
})

export default store