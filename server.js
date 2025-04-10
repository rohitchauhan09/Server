import express from "express";
import cors from "cors";
import { dbConnect } from "./Database/db.js";
import env from "dotenv"
import { Route } from "./Routes/user.routes.js";
import cookieParser from "cookie-parser";

env.config()

const app = express();
//middle to acees th cookies data throuout the server
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

(async () => {
    await dbConnect()
    app.listen(PORT, () => {
        console.log(`Server is running on  ${PORT}`)
    })
})()

app.use(cors(
    {
        origin: "https://webtechblogs.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        exposedHeaders:["Authorization"]
    }
))



app.use(express.json())


//  middleWare to route 
app.use("/api", Route)



//middleware to handle error

app.use((err, req, res, next) => {
    const { statusCode, message } = err;
    
    if (statusCode || message) {
        res.status(statusCode || 500).json({message})
    } else {
        res.status(500).json({ message: "Internal Server Error" })
    }
    console.log("Status", statusCode, "error", message);
})
