const express = require('express');
const router = express.Router();
const { 
    saveQuiz, 
    getHistorico, 
    getUltimoQuiz 
} = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(authenticateToken);

// POST /api/quiz - Salvar respostas do quiz
router.post('/', saveQuiz);

// GET /api/quiz/historico - Buscar histórico de quizzes
router.get('/historico', getHistorico);

// GET /api/quiz/ultimo - Buscar último quiz
router.get('/ultimo', getUltimoQuiz);

module.exports = router;
