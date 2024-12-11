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

export { app }
