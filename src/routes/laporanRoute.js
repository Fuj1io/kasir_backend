import { Router } from "express";
import { getLaporan } from "../controllers/LaporanController.js";
import { authUser } from "../middlewares/authUser.js";

const laporanRoute = Router();
laporanRoute.get("/", authUser, getLaporan);
export default laporanRoute;
