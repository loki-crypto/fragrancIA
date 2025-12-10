const express = require('express');
const router = express.Router();
const { 
    getAllPerfumes, 
    getPerfumeById, 
    searchPerfumes,
    getRecomendations // <--- Importe a nova função
} = require('../controllers/perfumeController');

const { optionalAuth } = require('../middleware/auth'); // Se estiver usando auth

// 1. Listar todos
router.get('/', optionalAuth, getAllPerfumes);

// 2. Busca (Search)
router.get('/search', optionalAuth, searchPerfumes);

// 3. Recomendados (NOVA ROTA) - Tem que vir antes do /:id
router.get('/recomendados', optionalAuth, getRecomendations);

// 4. Buscar por ID (Sempre por último das rotas GET específicas)
router.get('/:id', optionalAuth, getPerfumeById);

module.exports = router;