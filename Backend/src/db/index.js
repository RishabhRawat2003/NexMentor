import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MONGODB Connected Sucessfully: ", connectionInstance.connection.host)
    } catch (error) {
        console.log("Error while Connecting to MONGODB: ", error)
        process.exit(1)
    }
}

export { connectDB }