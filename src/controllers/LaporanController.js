import { Op } from "sequelize";
import { Users, Produk, Transaksi, detailTransaksiModel, barangMasukModel, BarangKeluar, Laporan } from "../models/Index.js";

const parseDate = (str) => {
  if (!str) return null;
  // support YYYY-MM-DD and DD/MM/YYYY
  if (str.includes("/")) {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }
  return new Date(`${str}T00:00:00`);
};

const buildDateWhere = (dari, sampai, field = "tanggal") => {
  const where = {};
  const d1 = parseDate(dari);
  const d2 = parseDate(sampai);
  if (d1 && d2) {
    const end = new Date(d2);
    end.setHours(23, 59, 59, 999);
    where[field] = { [Op.between]: [d1, end] };
  } else if (d1) {
    where[field] = { [Op.gte]: d1 };
  } else if (d2) {
    const end = new Date(d2);
    end.setHours(23, 59, 59, 999);
    where[field] = { [Op.lte]: end };
  }
  return where;
};

export const getLaporan = async (req, res) => {
  try {
    const jenis = (req.query.jenis || "akhir").toLowerCase();
    const { dari, sampai } = req.query;

    // 1. Laporan User - filter by last_login range, return login/logout timestamps
    if (jenis === "user") {
      const where = buildDateWhere(dari, sampai, "last_login");
      const users = await Users.findAll({
        where,
        attributes: ["id_user", "username", "email", "role", "last_login", "last_logout", "createdAt"],
        order: [["last_login", "DESC"]],
      });
      return res.status(200).json({ jenis: "user", data: users });
    }

    // 2. Laporan Barang Masuk
    if (jenis === "masuk") {
      const where = buildDateWhere(dari, sampai, "tanggal");
      const data = await barangMasukModel.findAll({
        where,
        include: [
          { model: Produk, attributes: ["id_produk", "nama_produk", "harga"] },
          { model: Laporan, attributes: ["id_laporan", "keterangan", "tanggal", "id_user"] },
        ],
        order: [["tanggal", "DESC"]],
      });
      return res.status(200).json({ jenis: "masuk", data });
    }

    // 3. Laporan Barang Keluar
    if (jenis === "keluar") {
      const where = buildDateWhere(dari, sampai, "tanggal");
      const data = await BarangKeluar.findAll({
        where,
        include: [
          { model: Produk, attributes: ["id_produk", "nama_produk", "harga"] },
          { model: Laporan, attributes: ["id_laporan", "keterangan", "tanggal", "id_user", "id_transaksi"] },
        ],
        order: [["tanggal", "DESC"]],
      });
      // enrich with user/transaksi if needed
      return res.status(200).json({ jenis: "keluar", data });
    }

    // 4. Laporan Hasil Akhir (default)
    const tWhere = buildDateWhere(dari, sampai, "tanggal_transaksi");
    const bKeluarWhere = buildDateWhere(dari, sampai, "tanggal");
    const bMasukWhere = buildDateWhere(dari, sampai, "tanggal");

    const totalPenjualan = (await Transaksi.sum("total_bayar", { where: tWhere })) || 0;
    const totalTransaksi = await Transaksi.count({ where: tWhere });
    const totalBarangTerjual = (await BarangKeluar.sum("qty", { where: bKeluarWhere })) || 0;
    const totalBarangMasuk = (await barangMasukModel.sum("qty", { where: bMasukWhere })) || 0;
    const barangMenipis = await Produk.count({ where: { status: "menipis" } });
    const totalProduk = await Produk.count();

    // detail per transaksi for table if needed
    const transaksiList = await Transaksi.findAll({
      where: tWhere,
      include: [
        { model: Users, attributes: ["username", "role"] },
        { model: detailTransaksiModel, include: [{ model: Produk, attributes: ["nama_produk"] }] },
      ],
      order: [["tanggal_transaksi", "DESC"]],
      limit: 50,
    });

    return res.status(200).json({
      jenis: "akhir",
      data: {
        summary: {
          totalPenjualan: Number(totalPenjualan),
          totalTransaksi,
          totalBarangTerjual: Number(totalBarangTerjual),
          totalBarangMasuk: Number(totalBarangMasuk),
          barangMenipis,
          totalProduk,
        },
        transaksiList,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
