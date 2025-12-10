const express = require('express');
const router = express.Router();
const { 
    getAvaliacoesByPerfume, 
    createAvaliacao, 
    deleteAvaliacao 
} = require('../controllers/avaliacaoController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateAvaliacao } = require('../middleware/validation');

// GET /api/avaliacoes/perfume/:perfumeId - Listar avaliações de um perfume
router.get('/perfume/:perfumeId', optionalAuth, getAvaliacoesByPerfume);

// POST /api/avaliacoes/:perfumeId - Criar avaliação (precisa estar logado)
router.post('/:perfumeId', authenticateToken, validateAvaliacao, createAvaliacao);

// DELETE /api/avaliacoes/:avaliacaoId - Deletar avaliação (precisa estar logado)
router.delete('/:avaliacaoId', authenticateToken, deleteAvaliacao);

module.exports = router;
