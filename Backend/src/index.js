import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import { app, server } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("ERROR", error)
            throw error
        })
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 8000}`);
        })
    })
    .catch((error) => {
        console.error("ERROR While connecting to Database: ", error)
    })