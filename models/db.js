const { Sequelize } = require('sequelize');
const mysql2 = require("mysql2");

const sequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        dialect: "mysql",
        dialectModule: mysql2,
        logging: false,
        pool: { 
            max: 5, 
            min: 0, 
            idle: 30000, 
            acquire: 10000 
        },

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;