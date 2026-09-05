import sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        dialect : 'mysql',
        host    : process.env.DB_HOST, 
        port    : process.env.DB_PORT 
    }
);
export default db;