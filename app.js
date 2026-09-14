import express from "express";
import dotenv from 'dotenv';
import cookiesParser from "cookie-parser";
import cors from "cors";

import db from "./src/configs/connectDB.js";
import userRoute from "./src/routes/userRoute.js";
import produkRoute from "./src/routes/produkRoute.js";
import transaksiRoute from "./src/routes/transaksiRoute.js";
import laporanRoute from "./src/routes/laporanRoute.js";
import "./src/models/Index.js";


dotenv.config();
const app = express();

// connectDB
(async () => {
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    console.log("DB connected & models synced!");
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
  origin: 'http://localhost:5173' //ganti sesuai url frontend
}))

//route
app.use("/user", userRoute);
app.use("/produk", produkRoute);
app.use("/transaksi", transaksiRoute);
app.use("/laporan", laporanRoute);

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
