import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

//Mentor Routes
import mentorRouter from './routes/mentor.routes.js'


app.use("/api/v1/mentors", mentorRouter)


//Student Routes
import studentRouter from './routes/student.routes.js'

app.use("/api/v1/students", studentRouter)


export default app