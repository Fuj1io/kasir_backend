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
        port    : process.env.DB_PORT,
        timezone: '+07:00', // ponytail: WIB, ganti '+08:00'/'+09:00' untuk WITA/WIT
        dialectOptions: {
            timezone: '+07:00'
        }
    }
);
export default db;