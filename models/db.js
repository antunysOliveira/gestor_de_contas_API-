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
        pool: { max: 5, min: 0, idle: 30000, acquire: 10000 }
    }
);
// 2. Criar o objeto 'db'
const db = {};

// 3. Adicionar as instâncias ao objeto 'db'
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 4. (REMOVIDO DAQUI) A linha 'db.sequelize.sync()' que estava causando o erro.
//    Nós vamos movê-la para o app.js

// 5. Exportar o objeto 'db' para outros arquivos (como User.js) usarem
module.exports = db;