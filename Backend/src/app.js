import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Read about all these middlewares -> https://www.notion.so/Common-Middlewares-15304dedbc5e80fba982d222967f9136
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

// routes import 
import userRouter from "./routes/user.route.js"

// routes declaration
app.use("/api/v1/users", userRouter)  // when you hit this route https://localhost:8000//api/v1/users , the control will be shifted to userRouter
// when you are making an API then it is a good practice to follow this convention, -> /api/version/endpoint

export { app }
