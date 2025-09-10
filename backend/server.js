import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import yup from 'yup';

// Esquema de validação para registro de usuário
const registerValidate = yup.object().shape({
    nome: yup.string().required().min(5, 'O nome deve ter ao menos 5 caracteres'),
    email: yup.string().email().required(),
    senha: yup.string().required().min(7).max(32).matches(/[a-z]/, 'A senha deve conter ao menor uma leta minúscula').matches(/[A-Z]/, 'A senha deve ao menos conter uma letra maiúscula').matches(/[0-9]/, 'A senha deve conter ao menos um número').matches(/[^a-zA-Z0-9]/, 'A senha deve conter ao menos um caractere especial')
})

// Configura dotenv
dotenv.config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET

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
            'INSERT INTO users (nome, email ,senha) VALUES ($1, $2, $3) RETURNING id, nome',
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

// Rota para login de usuário
app.post('/login', async (req, res) => {
    try {
        const {nome, senha} = req.body;
        
        // Verifica se o usuário existe
        const user = await db.oneOrNone('SELECT * FROM users WHERE nome = $1', [nome]);
        if (!user) {
            return res.status(400).json({ error: 'Usuário não cadastrado, Faça um cadastro para continuar' });
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Senha inválida' });
        }

        // Gera o token JWT e verefica o ambiente para definir o tempo de expiração
        const options = { expiresIn: process.env.NODE_ENV === 'test' ? '15m' : '30d' };
        const token = jwt.sign({ id: user.id, nome: user.nome}, JWT_SECRET, options);
        res.status(200).json({ token });
    } catch (err) {
        console.log('Erro ao fazer login:', err);
        res.status(500).json({
            error: 'Erro ao fazer login',
            message: err.message
        });
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