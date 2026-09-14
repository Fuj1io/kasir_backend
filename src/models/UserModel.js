import db from "../configs/connectDB.js";
import { DataTypes } from "sequelize";

export const Users = db.define('Users', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_logout: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
})