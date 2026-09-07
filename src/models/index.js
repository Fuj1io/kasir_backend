import { Users } from "./UserModel.js";
import { Kategori } from "./kategoriModel.js";
import { Produk } from "./produkModel.js";
import { Transaksi } from "./transaksiModel.js";
import { detailTransaksiModel } from "./detailTransaksiModel.js";
import { barangMasukModel } from "./barangMasukModel.js";
import { BarangKeluar } from "./barangKeluarModel.js";
import { Laporan } from "./laporanModel.js";

// 1. Relasi User dengan Transaksi (1 to Many)
Users.hasMany(Transaksi, { foreignKey: 'id_user' });
Transaksi.belongsTo(Users, { foreignKey: 'id_user' });

// 2. Relasi Kategori dengan Produk (1 to Many)
Kategori.hasMany(Produk, { foreignKey: 'id_kategori' });
Produk.belongsTo(Kategori, { foreignKey: 'id_kategori' });

// 3. Relasi Transaksi dengan Detail Transaksi (1 to Many)
Transaksi.hasMany(detailTransaksiModel, { foreignKey: 'id_transaksi' });
detailTransaksiModel.belongsTo(Transaksi, { foreignKey: 'id_transaksi' });

// 4. Relasi Produk dengan Detail Transaksi (1 to Many)
Produk.hasMany(detailTransaksiModel, { foreignKey: 'id_produk' });
detailTransaksiModel.belongsTo(Produk, { foreignKey: 'id_produk' });

// 5. Relasi Produk dengan Barang Masuk (1 to Many)
Produk.hasMany(barangMasukModel, { foreignKey: 'id_produk' });
barangMasukModel.belongsTo(Produk, { foreignKey: 'id_produk' });

// 6. Relasi Produk dengan Barang Keluar (1 to Many)
Produk.hasMany(BarangKeluar, { foreignKey: 'id_produk' });
BarangKeluar.belongsTo(Produk, { foreignKey: 'id_produk' });

// 7. Relasi Laporan dengan Barang Masuk (1 to Many)
Laporan.hasMany(barangMasukModel, { foreignKey: 'id_laporan' });
barangMasukModel.belongsTo(Laporan, { foreignKey: 'id_laporan' });

// 8. Relasi Laporan dengan Barang Keluar (1 to Many)
Laporan.hasMany(BarangKeluar, { foreignKey: 'id_laporan' });
BarangKeluar.belongsTo(Laporan, { foreignKey: 'id_laporan' });

// 9. Relasi Laporan dengan User (1 to Many, Opsional)
Users.hasMany(Laporan, { foreignKey: 'id_user' });
Laporan.belongsTo(Users, { foreignKey: 'id_user' });

// 10. Relasi Laporan dengan Transaksi (1 to Many, Opsional)
Transaksi.hasMany(Laporan, { foreignKey: 'id_transaksi' });
Laporan.belongsTo(Transaksi, { foreignKey: 'id_transaksi' });

// 11. Relasi Laporan dengan Produk (1 to Many, Opsional)
Produk.hasMany(Laporan, { foreignKey: 'id_produk' });
Laporan.belongsTo(Produk, { foreignKey: 'id_produk' });

export {
    Users,
    Kategori,
    Produk,
    Transaksi,
    detailTransaksiModel,
    barangMasukModel,
    BarangKeluar,
    Laporan
};
