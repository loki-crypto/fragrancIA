const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Registrar novo usuário
router.post('/register', validateRegister, register);

// POST /api/auth/login - Login
router.post('/login', validateLogin, login);

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', authenticateToken, getMe);

module.exports = router;
