import { DataTypes } from "sequelize";
import db from "../configs/connectDB.js";

export const Transaksi = db.define("Transaksi", {
    id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal_transaksi: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_bayar: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    freezeTableName: true
});