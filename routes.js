const express = require('express');
const router = express.Router();

// Importar seus controllers
// Vamos comentar o de postagens por enquanto
// const postagensController = require('./controllers/postagensController'); 
const authController = require('./controllers/authController');

// Importar o middleware
// const checkAuth = require('./middleware/checkAuth'); // Vamos comentar por enquanto

// --- Rotas Públicas ---
router.post('/login', authController.Login);
router.post('/register', authController.register); // Corrigido de 'Register' para 'register'

// --- Rotas de Postagens (Comentadas por agora) ---
// router.get('/postagens', postagensController.getAll);

// --- Rotas Privadas (Comentadas por agora) ---
// router.post('/postagens', checkAuth, postagensController.create);
// router.put('/postagens/:id', checkAuth, postagensController.update);
// router.delete('/postagens/:id', checkAuth, postagensController.delete);

module.exports = router;