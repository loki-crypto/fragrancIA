/**
 * Middleware de Autenticação JWT
 */

const { verifyToken } = require('../utils/generateToken');

/**
 * Verifica se o usuário está autenticado
 */
const authenticateToken = (req, res, next) => {
    try {
        // Pega o token do header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Token não fornecido',
                message: 'Você precisa estar logado para acessar este recurso'
            });
        }
        
        // Verifica o token
        const decoded = verifyToken(token);
        
        // Adiciona os dados do usuário à requisição
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: 'Token inválido ou expirado',
            message: 'Faça login novamente'
        });
    }
};

/**
 * Middleware opcional - Tenta autenticar mas não bloqueia
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
        }
    } catch (error) {
        // Ignora erros - autenticação é opcional
    }
    
    next();
};

module.exports = {
    authenticateToken,
    optionalAuth
};