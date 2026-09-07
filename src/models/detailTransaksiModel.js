import { DataTypes } from "sequelize";
import db from "../configs/connectDB.js";

export const detailTransaksiModel = db.define("detail_transaksi", {
    id_detail_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    harga_satuan: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
});