import express from "express";
import dotenv from 'dotenv';
import cookiesParser from "cookie-parser";
import cors from "cors";

import db from "./src/configs/connectDB.js";
import userRouter from "./src/routes/userRouter.js";


dotenv.config();
const app = express();

// connectDB
(async () => {
  try {
    await db.authenticate({ alter: true });
    console.log("DB connected !")
  } catch (error) {
    console.log(error)
  }
})()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))

//route
app.use("/user", userRouter);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
