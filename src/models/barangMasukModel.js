import { DataTypes } from "sequelize";
import db from "../configs/connectDB.js";

export const barangMasukModel = db.define("barang_masuk", {
    id_masuk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_laporan: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    table_name: 'barang_masuk'
});