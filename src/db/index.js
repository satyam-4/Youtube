import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from  "../constants.js";

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MONGODB connected !! DB HOST: ${connectionInstance}`)
    } catch (error) {
        console.log("MONGODB connection FAILED", error)
        process.exit(1)
    }
}

export { connectDB }