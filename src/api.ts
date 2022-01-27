import express from "express";
import { router as authRouter } from "./routes/auth";
import cookieParser from "cookie-parser";

// App
export const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Test route
// app.get("/", (_, res) => res.status(200).send("Hello world"));

// Routers
app.use("/api/auth", authRouter);
