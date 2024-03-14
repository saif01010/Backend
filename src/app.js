import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
// import session from "express-session";


const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
    methods:"GET,POST,PUT,DELETE",
}));

// app.use(session({
//     secret:'secret',
//     resave:false,
//     saveUninitialized:false,
   
// }));

// app.use(passport.authenticate('session'))

app.use(express.json({limit:"16kb"}));

app.use(express.static('public'));

app.use(express.urlencoded({limit:"16kb",extended:true}));

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))




//importing routes

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";
import tweetRouter from "./routes/tweet.route.js";
import likeRouter from "./routes/like.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import homeRouter from "./routes/home.route.js";
// import googleRouter from "./middlewares/google.auth.middleware.js"


// app.use("/api/v1/auth",googleRouter);
app.use("/",homeRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/tweets",tweetRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/subs",subscriptionRouter);


export {app};
