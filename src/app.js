import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({limit:"16kb",extended:true}));

app.use(cookieParser());

//importing routes

import userRouter from "./routes/user.route.js";

app.use("/api/v1/users",userRouter);


export {app};
