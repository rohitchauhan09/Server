import mongoose from "mongoose";
import env from "dotenv"
env.config()

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error in connecting Mongo DB",error.message)
    }
}