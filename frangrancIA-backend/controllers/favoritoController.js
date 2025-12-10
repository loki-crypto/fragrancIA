/**
 * Controller de Favoritos
 */

const { query } = require('../config/database');

/**
 * Listar favoritos do usuário
 * GET /api/favoritos
 */
const getFavoritos = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        
        const result = await query(`
            SELECT 
                f.data_adicionado,
                p.id_perfume,
                p.nome,
                p.descricao,
                p.imagem_url,
                p.preco_min,
                p.preco_max,
                m.nome as marca_nome,
                m.id_marca
            FROM favorito f
            JOIN perfume p ON f.id_perfume = p.id_perfume
            JOIN marca m ON p.id_marca = m.id_marca
            WHERE f.id_usuario = $1
            ORDER BY f.data_adicionado DESC
        `, [id_usuario]);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar favoritos' 
        });
    }
};

/**
 * Adicionar perfume aos favoritos
 * POST /api/favoritos/:perfumeId
 */
const addFavorito = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { perfumeId } = req.params;
        
        // Verifica se o perfume existe
        const perfumeExists = await query(
            'SELECT id_perfume FROM perfume WHERE id_perfume = $1 AND ativo = true',
            [perfumeId]
        );
        
        if (perfumeExists.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Perfume não encontrado' 
            });
        }
        
        // Verifica se já está nos favoritos
        const alreadyFavorited = await query(
            'SELECT * FROM favorito WHERE id_usuario = $1 AND id_perfume = $2',
            [id_usuario, perfumeId]
        );
        
        if (alreadyFavorited.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Perfume já está nos favoritos' 
            });
        }
        
        // Adiciona aos favoritos
        const result = await query(
            `INSERT INTO favorito (id_usuario, id_perfume) 
             VALUES ($1, $2) 
             RETURNING *`,
            [id_usuario, perfumeId]
        );
        
        res.status(201).json({
            message: 'Perfume adicionado aos favoritos!',
            favorito: result.rows[0]
        });
        
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ 
            error: 'Erro ao adicionar favorito' 
        });
    }
};

/**
 * Remover perfume dos favoritos
 * DELETE /api/favoritos/:perfumeId
 */
const removeFavorito = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { perfumeId } = req.params;
        
        const result = await query(
            'DELETE FROM favorito WHERE id_usuario = $1 AND id_perfume = $2 RETURNING *',
            [id_usuario, perfumeId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Favorito não encontrado' 
            });
        }
        
        res.json({
            message: 'Perfume removido dos favoritos!'
        });
        
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ 
            error: 'Erro ao remover favorito' 
        });
    }
};

/**
 * Verificar se perfume está nos favoritos
 * GET /api/favoritos/check/:perfumeId
 */
const checkFavorito = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { perfumeId } = req.params;
        
        const result = await query(
            'SELECT * FROM favorito WHERE id_usuario = $1 AND id_perfume = $2',
            [id_usuario, perfumeId]
        );
        
        res.json({
            isFavorito: result.rows.length > 0
        });
        
    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        res.status(500).json({ 
            error: 'Erro ao verificar favorito' 
        });
    }
};

module.exports = {
    getFavoritos,
    addFavorito,
    removeFavorito,
    checkFavorito
};