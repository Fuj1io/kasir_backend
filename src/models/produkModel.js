
import { DataTypes } from "sequelize";
import db from "../configs/connectDB.js";

export const Produk = db.define("Produk", {
    id_produk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_produk: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gambar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM("aman", "menipis", "habis"),
        allowNull: false,
        defaultValue: "aman"
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    table_name: 'produk'
});
