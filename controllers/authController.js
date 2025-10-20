const User = require('../models/User'); // Importa o Model que acabamos de criar
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

    // --- Rota de REGISTRO (POST /register) ---
    async register(req, res) {
        // 1. Pega email e senha do body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        try {
            // 2. Verifica se o usuário já existe
            const userExists = await User.findOne({ where: { email } });

            if (userExists) {
                return res.status(400).json({ error: 'Este email já está em uso' });
            }

            // 3. Cria o usuário no banco
            // (O 'hook' no Model User.js vai criptografar a senha)
            const newUser = await User.create({
                email,
                password
            });

            // 4. Retorna sucesso (sem a senha)
            return res.status(201).json({
                id: newUser.id,
                email: newUser.email
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    },

    // --- Rota de LOGIN (POST /login) ---
    async Login(req, res) { // Nome 'Login' (maiúsculo) como no seu routes.js
        // 1. Pega email e senha do body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        try {
            // 2. Encontra o usuário pelo email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                // Usuário não encontrado
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            // 3. Compara a senha enviada com a senha "hasheada" do banco
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                // Senha errada
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            // 4. Se chegou aqui, o login é válido. Gera o token JWT.
            const token = jwt.sign(
                { id: user.id, email: user.email }, // O que salvar no token
                process.env.JWT_SECRET,             // Sua Chave Secreta do .env
                { expiresIn: '7d' }                 // Expiração
            );

            // 5. Retorna o token para o frontend
            return res.status(200).json({ token });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno ao tentar fazer login' });
        }
    }
};