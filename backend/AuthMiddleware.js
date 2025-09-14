import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    // Verifica se o token está presente no cabeçalho Authorization e começa com Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token do cabeçalho
            const token = req.headers.authorization.split(' ')[1]

            // Verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Adiciona os dados do usuário decodificados ao objeto req para uso posterior
            req.user = decoded;
            next()
        } catch (error) {
            return res.status(401).json({error: 'Token inválido ou expirado'})
        }
    } else {
        return res.status(401).json({error: 'Token não fornecido'})
    }
}

export default protect;