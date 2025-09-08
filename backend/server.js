import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import yup from 'yup';

// 
const registerValidate = yup.object().shape({
    nome: yup.string().required().min(5),
    email: yup.string().email().required(),
    senha: yup.string().required().min(7).max(32).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/).matches(/[^a-zA-Z0-9]/)
})

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


// Rota para pegar todos os agendamentos e exibi-los
app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await db.any('SELECT * FROM agendamentos');
        res.status(200).json(agendamentos);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
})

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
    try {
        const {nome, senha, email} = req.body;

        // Validação dos dados com yup
        await registerValidate.validate({nome, senha, email}, {
            abortEarly: false
        });

        // Verifica se o email já está em uso
        const existingUser = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso' });
        }

        // Hash da senha e inserção do novo usuário no banco de dados
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await db.one(
            'INSERT INTO usuarios (nome, email ,senha) VALUES ($1, $2, $3) RETURNING id, nome',
            [nome, email, hashedPassword]
        );
        res.status(201).json(newUser);
    } catch (error) {

        // Tratamento de erros de validação do yup
        if (error.name === 'ValidationError') {
            console.error('Erro de validação:', error.errors);
            return res.status(400).json({
                message: 'Erro de validação',
                errors: error.errors
            })
        }
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
})

// Rota para deletar um agendamento
app.delete('/agendamentos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const result = await db.result('DELETE FROM agendamentos WHERE id = $1', [id]);
        if(result.rowCount === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        res.status(200).json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ error: 'Erro ao deletar agendamento' });
    }
})

app.listen(8888, () => console.log('Server rodando na porta 8888'));