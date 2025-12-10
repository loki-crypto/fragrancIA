/**
 * Utilitários para hash de senhas com bcrypt
 */

const bcrypt = require('bcryptjs');

/**
 * Gera hash da senha
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Compara senha com hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {Promise<boolean>} True se a senha estiver correta
 */
const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};