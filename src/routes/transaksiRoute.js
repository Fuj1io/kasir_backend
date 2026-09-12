import { Router } from "express";
import { createTransaksi } from "../controllers/TransaksiController.js";
import { authUser } from "../middlewares/authUser.js";

const transaksiRoute = Router();

transaksiRoute.post("/", authUser, createTransaksi);

export default transaksiRoute;