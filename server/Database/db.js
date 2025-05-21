import mongoose from "mongoose";

export async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.error(error);
        console.log("Mongodb connection failed");
        process.exit(1);
    }
}