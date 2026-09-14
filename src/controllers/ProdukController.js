import { Produk } from "../models/produkModel.js";
import { Kategori } from "../models/kategoriModel.js";
import { Op } from "sequelize";

export const getAllProduk = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const s     = req.query.s || "";
        const kategori = req.query.kategori || "";
        const offset = (page - 1) * limit;

        // kondisi pencarian data dari query ketika malakukan pencarian
        const whereClouse = {};

        if(s) {
            whereClouse[Op.or] = [
                {nama_produk : {[Op.like]: `%${s}%`}}
            ]
        }

        const includeOption = [
            {
                model: Kategori,
                attributes: ['id_kategori', 'nama_kategori'],
                required: false
            }
        ];

        if (kategori && kategori !== "Semua") {
            if (!isNaN(kategori)) {
                whereClouse.id_kategori = parseInt(kategori);
            } else {
                let targetCategories = [kategori];
                if (kategori === "Bahan Makanan") {
                    targetCategories = ["Bahan Makanan", "bahan_makanan", "bahan makanan"];
                } else if (kategori === "Kebutuhan Harian" || kategori === "Kebutuhan Rumah") {
                    targetCategories = ["Kebutuhan Harian", "kebutuhan_harian", "kebutuhan_rumah", "Kebutuhan Rumah", "kebutuhan harian"];
                }

                includeOption[0].where = {
                    nama_kategori: {
                        [Op.in]: targetCategories
                    }
                };
                includeOption[0].required = true;
            }
        }

        // ambil data dan total baris secara bersamaan untuk pagination
        const {count, rows: produk} = await Produk.findAndCountAll({
            where: whereClouse,
            include: includeOption,
            limit : limit,
            offset : offset
        });

        const totalPage = Math.ceil(count / limit);
        return res.status(200).json({
            data: produk,
            total : count,
            page : page,
            limit: limit,
            totalPages: totalPage,
            message: "See More Book !"
        });
    } catch (error) {
        return  res.status(500).json({ message: error.message });
    }
};

export const getProdukBy = async (req, res) => {
    try {
        const produk = await Produk.findOne({
            where: { id_produk: req.params.id_produk }
        });
        if (!produk) return res.status(404).json({ message: "Produk tidak ditemukan" });
        return res.status(200).json(produk);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addProduk = async (req, res) => {
    try {
        const {nama_produk, harga, stok, kategori} = req.body;
       
        const produk = await Produk.create({
            nama_produk: nama_produk,
            harga: harga,
            stok: stok,
            id_kategori : kategori
        });

        return res.status(201).json({
            data: produk,
            message: `Berhasil Tambah ${produk.nama_produk}`
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const editProduk = async (req, res) => {
    try {
        const { id_produk } = req.params;
        const produk = await Produk.findOne({ where: { id_produk } });
        if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

        const { nama_produk, harga, stok, kategori, id_kategori } = req.body;
        const kategoriId = kategori ?? id_kategori;

        await produk.update({
            nama_produk: nama_produk ?? produk.nama_produk,
            harga: harga !== undefined ? harga : produk.harga,
            stok: stok !== undefined ? stok : produk.stok,
            id_kategori: kategoriId ?? produk.id_kategori,
        });

        return res.status(200).json({ data: produk, message: `Produk ${produk.nama_produk} berhasil diupdate` });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

export const deleteProduk = async (req, res) => {
    try {
        const { id_produk } = req.params;
        const produk = await Produk.findOne({ where: { id_produk } });
        if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

        await produk.destroy();
        return res.status(200).json({ message: `Produk ${produk.nama_produk} berhasil dihapus` });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};