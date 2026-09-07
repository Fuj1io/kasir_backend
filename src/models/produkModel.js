
import { DataTypes } from "sequelize";
import db from "../configs/connectDB";

export const Produk = db.define("Products", {
    id_produk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        allowNull: false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
