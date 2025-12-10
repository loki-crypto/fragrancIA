/**
 * Utilitários para geração e verificação de JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Gera token JWT
 * @param {Object} payload - Dados do usuário
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * Verifica token JWT
 * @param {string} token - Token a ser verificado
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

module.exports = {
    generateToken,
    verifyToken
};