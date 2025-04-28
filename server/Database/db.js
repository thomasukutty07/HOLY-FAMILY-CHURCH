import mongoose from "mongoose";

 export async function connectDb() {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully")
    } catch (error) {
        console.log.error(error)
        console.log("Mongodb connection failed")
    }

}