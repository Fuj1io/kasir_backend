import db from "../configs/connectDB.js";
import { DataTypes, Op } from "sequelize";

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

export const getOrCreateLaporanHarian = async ({ status = "laporan", id_user = null, transaction = null } = {}) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const findOptions = {
        where: {
            status,
            tanggal: {
                [Op.between]: [todayStart, todayEnd]
            }
        },
        order: [["tanggal", "DESC"]]
    };
    if (transaction) findOptions.transaction = transaction;

    let laporan = await Laporan.findOne(findOptions);
    if (!laporan) {
        const createOptions = transaction ? { transaction } : {};
        laporan = await Laporan.create({
            status,
            tanggal: new Date(),
            keterangan: `Laporan harian ${status === "keluar" ? "barang keluar" : status === "masuk" ? "barang masuk" : status}`,
            id_user: id_user || null,
        }, createOptions);
    }
    return laporan;
};