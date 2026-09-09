import db from "../configs/connectDB.js";
import { DataTypes } from "sequelize";

export const Laporan = db.define("laporan", {
    id_laporan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_transaksi: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_produk: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true
});