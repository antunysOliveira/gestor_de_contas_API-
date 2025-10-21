const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(cors()); 

const allRoutes = require('./routes');
app.use(allRoutes);

const db = require('./models/db'); 

app.use(express.json());

const allRoutes = require('./routes');
app.use(allRoutes);

app.get("/", function (req, res) {
    res.send("API de Controle Financeiro no ar!");
});

const PORT = process.env.PORT || 8081;

db.sequelize.sync()
    .then(() => {
        console.log("Banco de dados sincronizado com sucesso.");
        
        app.listen(PORT, function () {
            console.log(`API iniciada com sucesso em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Erro ao sincronizar o banco de dados:", err);
    });
