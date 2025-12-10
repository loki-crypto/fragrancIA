/**
 * Controller de Autenticação
 */

const { query } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

/**
 * Registrar novo usuário
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verifica se o email já existe
        const existingUser = await query(
            'SELECT id_usuario FROM usuario WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Email já cadastrado' 
            });
        }
        
        // Hash da senha
        const senhaHash = await hashPassword(senha);
        
        // Insere o usuário
        const result = await query(
            `INSERT INTO usuario (nome, email, senha_hash) 
             VALUES ($1, $2, $3) 
             RETURNING id_usuario, nome, email, data_cadastro`,
            [nome, email, senhaHash]
        );
        
        const user = result.rows[0];
        
        // Gera token JWT
        const token = generateToken({
            id_usuario: user.id_usuario,
            email: user.email,
            nome: user.nome
        });
        
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            token,
            user: {
                id_usuario: user.id_usuario,
                nome: user.nome,
                email: user.email,
                data_cadastro: user.data_cadastro
            }
        });
        
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ 
            error: 'Erro ao criar usuário',
            message: error.message 
        });
    }
};

/**
 * Login de usuário
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Busca usuário por email
        const result = await query(
            'SELECT * FROM usuario WHERE email = $1 AND ativo = true',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Email ou senha incorretos' 
            });
        }
        
        const user = result.rows[0];
        
        // Verifica a senha
        const senhaValida = await comparePassword(senha, user.senha_hash);
        
        if (!senhaValida) {
            return res.status(401).json({ 
                error: 'Email ou senha incorretos' 
            });
        }
        
        // Gera token JWT
        const token = generateToken({
            id_usuario: user.id_usuario,
            email: user.email,
            nome: user.nome
        });
        
        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id_usuario: user.id_usuario,
                nome: user.nome,
                email: user.email,
                data_cadastro: user.data_cadastro
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer login',
            message: error.message 
        });
    }
};

/**
 * Obter dados do usuário logado
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        const result = await query(
            `SELECT id_usuario, nome, email, data_cadastro 
             FROM usuario 
             WHERE id_usuario = $1 AND ativo = true`,
            [req.user.id_usuario]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado' 
            });
        }
        
        res.json(result.rows[0]);
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar dados do usuário' 
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};