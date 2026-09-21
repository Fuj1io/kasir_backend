import { Op } from "sequelize";
import { Users, Produk, Transaksi, detailTransaksiModel, barangMasukModel, BarangKeluar, Laporan } from "../models/Index.js";

const parseDate = (str) => {
  if (!str) return null;
  if (str instanceof Date) return str;
  // support YYYY-MM-DD and DD/MM/YYYY
  if (typeof str === "string" && str.includes("/")) {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }
  return new Date(`${str}T00:00:00`);
};

const formatDateOnly = (d) => {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
    const end = new Date(d1);
    end.setHours(23, 59, 59, 999);
    where[field] = { [Op.between]: [d1, end] };
  } else if (d2) {
    const end = new Date(d2);
    end.setHours(23, 59, 59, 999);
    where[field] = { [Op.lte]: end };
  }
  return where;
};

const getLatestDateForJenis = async (jenis) => {
  let latest = null;
  if (jenis === "masuk") {
    latest = await barangMasukModel.max("tanggal");
  } else if (jenis === "keluar") {
    latest = await BarangKeluar.max("tanggal");
  } else if (jenis === "user") {
    latest = await Users.max("last_login");
  } else {
    latest = await Transaksi.max("tanggal_transaksi");
    if (!latest) latest = await BarangKeluar.max("tanggal");
    if (!latest) latest = await barangMasukModel.max("tanggal");
  }
  if (!latest) {
    const lapMax = await Laporan.max("tanggal");
    if (lapMax) latest = lapMax;
  }
  return latest ? formatDateOnly(latest) : formatDateOnly(new Date());
};

export const getLaporan = async (req, res) => {
  try {
    const jenis = (req.query.jenis || "akhir").toLowerCase();
    const isCustomFilter = Boolean(req.query.dari || req.query.sampai);

    let effectiveDari = req.query.dari;
    let effectiveSampai = req.query.sampai;

    if (!isCustomFilter) {
      const latestDate = await getLatestDateForJenis(jenis);
      effectiveDari = latestDate;
      effectiveSampai = latestDate;
    }

    // 1. Laporan User
    if (jenis === "user") {
      const where = buildDateWhere(effectiveDari, effectiveSampai, "last_login");
      const users = await Users.findAll({
        where: isCustomFilter ? where : {},
        attributes: ["id_user", "username", "email", "role", "last_login", "last_logout", "createdAt"],
        order: [["last_login", "DESC"]],
      });
      return res.status(200).json({
        jenis: "user",
        tanggal: effectiveDari,
        dari: effectiveDari,
        sampai: effectiveSampai,
        isLatest: !isCustomFilter,
        data: users
      });
    }

    // 2. Laporan Barang Masuk
    if (jenis === "masuk") {
      const where = buildDateWhere(effectiveDari, effectiveSampai, "tanggal");
      const data = await barangMasukModel.findAll({
        where,
        include: [
          { model: Produk, attributes: ["id_produk", "nama_produk", "harga"] },
          { model: Laporan, attributes: ["id_laporan", "keterangan", "tanggal", "id_user"] },
        ],
        order: [["tanggal", "DESC"]],
      });
      return res.status(200).json({
        jenis: "masuk",
        tanggal: effectiveDari,
        dari: effectiveDari,
        sampai: effectiveSampai,
        isLatest: !isCustomFilter,
        data
      });
    }

    // 3. Laporan Barang Keluar
    if (jenis === "keluar") {
      const where = buildDateWhere(effectiveDari, effectiveSampai, "tanggal");
      const data = await BarangKeluar.findAll({
        where,
        include: [
          { model: Produk, attributes: ["id_produk", "nama_produk", "harga"] },
          { model: Laporan, attributes: ["id_laporan", "keterangan", "tanggal", "id_user", "id_transaksi"] },
        ],
        order: [["tanggal", "DESC"]],
      });
      return res.status(200).json({
        jenis: "keluar",
        tanggal: effectiveDari,
        dari: effectiveDari,
        sampai: effectiveSampai,
        isLatest: !isCustomFilter,
        data
      });
    }

    // 4. Laporan Hasil Akhir (default)
    const tWhere = buildDateWhere(effectiveDari, effectiveSampai, "tanggal_transaksi");
    const bKeluarWhere = buildDateWhere(effectiveDari, effectiveSampai, "tanggal");
    const bMasukWhere = buildDateWhere(effectiveDari, effectiveSampai, "tanggal");

    const totalPenjualan = (await Transaksi.sum("total_bayar", { where: tWhere })) || 0;
    const totalTransaksi = await Transaksi.count({ where: tWhere });
    const totalBarangTerjual = (await BarangKeluar.sum("qty", { where: bKeluarWhere })) || 0;
    const totalBarangMasuk = (await barangMasukModel.sum("qty", { where: bMasukWhere })) || 0;
    const barangMenipis = await Produk.count({ where: { status: "menipis" } });
    const totalProduk = await Produk.count();

    const transaksiList = await Transaksi.findAll({
      where: tWhere,
      include: [
        { model: Users, attributes: ["username", "role"] },
        { model: detailTransaksiModel, include: [{ model: Produk, attributes: ["nama_produk"] }] },
      ],
      order: [["tanggal_transaksi", "DESC"]],
      limit: 100,
    });

    return res.status(200).json({
      jenis: "akhir",
      tanggal: effectiveDari,
      dari: effectiveDari,
      sampai: effectiveSampai,
      isLatest: !isCustomFilter,
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
