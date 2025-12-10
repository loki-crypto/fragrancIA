const express = require('express');
const router = express.Router();
const { 
    getFavoritos, 
    addFavorito, 
    removeFavorito 
} = require('../controllers/favoritoController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas precisam de autenticação
router.use(authenticateToken);

// GET /api/favoritos - Listar favoritos do usuário
router.get('/', getFavoritos);

// POST /api/favoritos/:perfumeId - Adicionar aos favoritos
router.post('/:perfumeId', addFavorito);

// DELETE /api/favoritos/:perfumeId - Remover dos favoritos
router.delete('/:perfumeId', removeFavorito);

module.exports = router;
