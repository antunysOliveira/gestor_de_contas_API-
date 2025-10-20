const express = require("express");
const app = express();
require('dotenv').config();

// Importa a conexão do db.js
const db = require('./models/db'); // <-- Importa o 'db' que acabamos de corrigir

// Habilita o Express para ler JSON
app.use(express.json());

// Importa e usa seu arquivo de rotas
const allRoutes = require('./routes');
app.use(allRoutes);

// Rota raiz de "health check"
app.get("/", function (req, res) {
    res.send("API de Controle Financeiro no ar!");
});

// Define a porta
const PORT = process.env.PORT || 8081;

// -----------------------------------------------------------------
// NOVO: Sincronizar o banco de dados e DEPOIS iniciar o servidor
// -----------------------------------------------------------------
db.sequelize.sync()
    .then(() => {
        console.log("Banco de dados sincronizado com sucesso.");
        
        // Inicia o servidor SÓ DEPOIS que o banco estiver pronto
        app.listen(PORT, function () {
            console.log(`API iniciada com sucesso em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Erro ao sincronizar o banco de dados:", err);
    });

// A linha 'app.listen(...)' que estava aqui foi movida para dentro do '.then()'