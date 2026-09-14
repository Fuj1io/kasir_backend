import db from "../configs/connectDB.js";
import { Produk, Transaksi, detailTransaksiModel, BarangKeluar, Laporan } from "../models/Index.js";
import { getStatusStok } from "../models/produkModel.js";

export const createTransaksi = async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Keranjang transaksi kosong" });
    }

    const transaction = await db.transaction();

    try {
        const details = [];
        let total = 0;

        for (const item of items) {
            const qty = Number(item.qty);
            if (!Number.isInteger(qty) || qty <= 0) {
                throw new Error("Jumlah produk tidak valid");
            }

            const produk = await Produk.findByPk(item.id_produk, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!produk) {
                throw new Error(`Produk ${item.id_produk} tidak ditemukan`);
            }
            if (produk.stok < qty) {
                throw new Error(`Stok ${produk.nama_produk} tidak mencukupi`);
            }

            const subtotal = produk.harga * qty;
            total += subtotal;
            details.push({ produk, qty, harga_satuan: produk.harga, subtotal });
        }

        const transaksi = await Transaksi.create({
            id_user: req.userId,
            tanggal_transaksi: new Date(),
            total_bayar: total,
            status: "selesai"
        }, { transaction });

        const laporan = await Laporan.create({
            status: "keluar",
            tanggal: new Date(),
            keterangan: `Transaksi #${transaksi.id_transaksi}`,
            id_transaksi: transaksi.id_transaksi,
            id_user: req.userId || null,
        }, { transaction });

        for (const detail of details) {
            await detailTransaksiModel.create({
                id_transaksi: transaksi.id_transaksi,
                id_produk: detail.produk.id_produk,
                qty: detail.qty,
                harga_satuan: detail.harga_satuan,
                subtotal: detail.subtotal
            }, { transaction });

            const stokBaru = detail.produk.stok - detail.qty;
            await detail.produk.update({
                stok: stokBaru,
                status: getStatusStok(stokBaru)
            }, { transaction });

            await BarangKeluar.create({
                id_produk: detail.produk.id_produk,
                qty: detail.qty,
                tanggal: new Date(),
                id_laporan: laporan.id_laporan,
            }, { transaction });
        }

        await transaction.commit();
        return res.status(201).json({
            data: transaksi,
            total,
            message: "Transaksi berhasil disimpan"
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: error.message });
    }
};