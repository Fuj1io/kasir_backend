import express from "express";
import dotenv from 'dotenv';
import cookiesParser from "cookie-parser";

import db from "./src/configs/connectDB.js";
import userRouter from "./src/routes/userRouter.js";
import { Users } from "./src/models/UserModel.js";

dotenv.config();
const app = express();

// connectDB
(async() => {
  try {
    await db.authenticate({alter: true});
    await Users.sync({alter: true});
    console.log("DB connected !")
  } catch (error) {
    console.log(error)
  }
})()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());

//route
app.use("/user", userRouter);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
