import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';

// Configura dotenv
dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
}

app.use(cors(corsOptions));
app.use(express.json());


// Rota para pegar todos os lugares
app.get('/lugares', async (req, res) => {
    try {
        const locais = await db.any('SELECT * FROM locais');
        res.status(200).json(locais);
    } catch (error) {
        console.error('Erro ao buscar lugares:', error);
        res.status(500).json({ error: 'Erro ao buscar lugares' });
    }
})

//Rota para agendar um local
app.post('/agendar', async (req, res) => {
    try {
        const {local, dataHoraInicio, dataHoraFim} = req.body;
        if (!local || !dataHoraInicio || !dataHoraFim) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        const agendamento = await db.one(
            'INSERT INTO agendamentos (local, data_inicio, data_termino) VALUES($1, $2, $3) RETURNING *',
            [local, dataHoraInicio, dataHoraFim]
        )
        console.log('Agendamento criado:', agendamento);
        res.status(201).json(agendamento);
    } catch (error) {
        console.error('Erro ao agendar local:', error);
        res.status(500).json({ error: 'Erro ao agendar local' });
    }
})

app.listen(8888, () => console.log('Server rodando na porta 8888'));