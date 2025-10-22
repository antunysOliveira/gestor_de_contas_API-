const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

    async register(req, res) {
        const { email, password } = req.body;

        if (!email || !password ) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        try {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Este email já está em uso' });
            }

            const newUser = await User.create({
                email,
                password,
            });

            return res.status(201).json({
                id: newUser.id,
                email: newUser.email,
            });

        } catch (err) {
            if (err.name === 'SequelizeDatabaseError' && err.original.code === 'ER_BAD_FIELD_ERROR') {
                 return res.status(500).json({ error: 'Erro de configuração do servidor.' });
            }
            console.error(err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    },

    async Login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        try {
            const user = await User.findOne({
                where: { email },
                attributes: ['id', 'email', 'password'] 
            });

            if (!user) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({ token });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno ao tentar fazer login' });
        }
    },

    // async recoverPassword(req, res) {
    //     const { email, telefone, novaSenha } = req.body;

    //     if (!email || !novaSenha) {
    //         return res.status(400).json({ error: 'Email, telefone e a nova senha são obrigatórios' });
    //     }

    //     try {
    //         const user = await User.findOne({
    //             where: { email },
    //             attributes: ['id', 'password']
    //         });

    //         if (!user) {
    //             return res.status(404).json({ error: 'Usuário não encontrado' });
    //         }

    //         if (user.telefone !== telefone) {
    //             return res.status(403).json({ error: 'Dados de recuperação inválidos' });
    //         }

    //         user.password = novaSenha;
    //         await user.save();

    //         return res.status(200).json({ message: 'Senha alterada com sucesso.' });

    //     } catch (err) {
    //         if (err.name === 'SequelizeDatabaseError' && err.original.code === 'ER_BAD_FIELD_ERROR') {
    //              console.error('Erro de banco: A coluna "telefone" não existe na tabela "Users".');
    //              return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    //         }
    //         console.error(err);
    //         return res.status(500).json({ error: 'Erro ao alterar senha' });
    //     }
    // }
};