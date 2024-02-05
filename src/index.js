// import dotenv from 'dotenv';
// import express from 'express';
import { app } from './app.js';
import connection from './db/index.js';


connection().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});