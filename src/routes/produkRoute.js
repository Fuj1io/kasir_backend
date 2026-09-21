import { Router } from "express";
import { getAllProduk, getProdukBy, addProduk, editProduk, deleteProduk } from "../controllers/ProdukController.js";
import { authUser, adminOnly } from "../middlewares/authUser.js";
const produkRoute = Router();

produkRoute.get("/", getAllProduk);
produkRoute.get("/:id_produk", getProdukBy);
produkRoute.post("/", authUser, adminOnly, addProduk);
produkRoute.put("/:id_produk", authUser, adminOnly, editProduk);
produkRoute.delete("/:id_produk", authUser, adminOnly, deleteProduk);

export default produkRoute;