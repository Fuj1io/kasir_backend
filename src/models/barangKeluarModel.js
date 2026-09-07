import db from "../configs/connectDB.js";
import { DataTypes } from "sequelize";

export const BarangKeluar = db.define("barang_keluar", {
    id_keluar: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_laporan: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});