const server = require('express');
const app = server();
const cors = require('cors');
const dotenv = require('dotenv').config();
const db = require('./db');

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
}

app.use(cors(corsOptions));
app.use(server.json());

app.get('lugares', async (req, res) => {
    try {
        const locais = await db.any('SELECT * FROM locais');
        res.status(200).json(locais);
    } catch (error) {
        console.error('Erro ao buscar lugares:', error);
        res.status(500).json({ error: 'Erro ao buscar lugares' });
    }
})

app.get('/lugares/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const local = await db.oneOrNone('SELECT * FROM locais WHERE id = $1', [id]);
        if(local) {
            res.status(200).json(local);
        } else {
            res.status(404).json({ error: 'Local não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar local:', error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(8888, () => console.log('Server rodando na porta 8888'));