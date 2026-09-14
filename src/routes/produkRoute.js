import { Router } from "express";
import { getAllProduk, getProdukBy, addProduk, editProduk, deleteProduk } from "../controllers/ProdukController.js";
import { authUser } from "../middlewares/authUser.js";
const produkRoute = Router();

produkRoute.get("/", getAllProduk);
produkRoute.get("/:id_produk", getProdukBy);
produkRoute.post("/", addProduk);
produkRoute.put("/:id_produk", editProduk);
produkRoute.delete("/:id_produk", deleteProduk);

export default produkRoute;