import { DataTypes } from "sequelize";
import db from "../configs/connectDB.js";

export const Kategori = db.define("Kategori", {
    id_kategori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama_kategori: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});

