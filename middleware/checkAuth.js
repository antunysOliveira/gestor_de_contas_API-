const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Pegar o header de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido (sem header)' });
    }

    // 2. O formato é "Bearer <token>". Precisamos separar.
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const token = parts[1];

    // 3. Verificar o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Se o token for expirado ou inválido
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      // 4. Se tudo deu certo, salva os dados do usuário na requisição
      // para que o próximo controller possa usá-los.
      req.userId = decoded.id; // Ex: Pega o ID do usuário que estava no token
      req.userEmail = decoded.email;

      // 5. Deixa a requisição continuar
      return next();
    });

  } catch (err) {
    return res.status(500).json({ error: 'Falha na autenticação' });
  }
};