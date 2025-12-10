/**
 * Middleware de Validação de Dados
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware para processar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Dados inválidos',
            details: errors.array() 
        });
    }
    
    next();
};

/**
 * Validações para registro de usuário
 */
const validateRegister = [
    body('nome')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Nome deve ter no mínimo 3 caracteres'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('senha')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres'),
    
    handleValidationErrors
];

/**
 * Validações para login
 */
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    
    handleValidationErrors
];

/**
 * Validações para avaliação
 */
const validateAvaliacao = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating deve ser entre 1 e 5'),
    
    body('comentario')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Comentário muito longo (máx 1000 caracteres)'),
    
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateAvaliacao,
    handleValidationErrors
};