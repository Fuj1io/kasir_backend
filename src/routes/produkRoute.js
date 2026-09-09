import { Router } from "express";
import { getAllProduk, getProdukBy, addProduk } from "../controllers/ProdukController.js";

const produkRoute = Router();

produkRoute.get("/", getAllProduk);
produkRoute.get("/:id_produk", getProdukBy);
produkRoute.post("/", addProduk);

export default produkRoute;