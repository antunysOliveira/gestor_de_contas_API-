const { DataTypes } = require('sequelize');
const db = require('./db'); // Importa sua conexão do db.js
const bcrypt = require('bcryptjs');

const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que não existam dois emails iguais
        validate: {
            isEmail: true // Validação do Sequelize para formato de email
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Hooks são funções que rodam em certos "momentos"
    // Este 'beforeCreate' vai rodar ANTES de um novo usuário ser salvo
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                // Gera o "sal" e "hashea" a senha em uma única etapa
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;