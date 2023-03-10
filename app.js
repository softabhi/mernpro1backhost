import express from "express";
import { config } from "dotenv";
import ErrorMidilware from "./middlewares/Error.js";
// import ErrorHandler from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
import cors from "cors";


// mongoose.set('strictQuery', false);

config({
    path: "./config/.env",
});

const app = express();

// using  middlewares

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTED_URL,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT"]
    })
);

import course from "./routes/courseRoutes.js";
import user from './routes/userRoutes.js'
// import ErrorMidilware from "./middlewares/Error.js";



app.use("/api/v1", course);
app.use("/api/v1", user);

export default app;

app.get("/", (req, res) => {
    res.send(`<h1>site is working ,to visete fronted click <a href=${process.env.FRONTED_URL}>here</a></h1>`)
})

app.use(ErrorMidilware);