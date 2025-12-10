/**
 * Controller de Avaliações
 */

const { query } = require('../config/database');

/**
 * Listar avaliações de um perfume
 * GET /api/avaliacoes/perfume/:perfumeId
 */
const getAvaliacoesByPerfume = async (req, res) => {
    try {
        const { perfumeId } = req.params;
        
        const result = await query(`
            SELECT 
                a.*,
                u.nome as usuario_nome
            FROM avaliacao a
            JOIN usuario u ON a.id_usuario = u.id_usuario
            WHERE a.id_perfume = $1
            ORDER BY a.data_avaliacao DESC
        `, [perfumeId]);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar avaliações' 
        });
    }
};

/**
 * Criar nova avaliação
 * POST /api/avaliacoes/:perfumeId
 */
const createAvaliacao = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { perfumeId } = req.params;
        const { rating, comentario } = req.body;
        
        // Verifica se o perfume existe
        const perfumeExists = await query(
            'SELECT id_perfume FROM perfume WHERE id_perfume = $1',
            [perfumeId]
        );
        
        if (perfumeExists.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Perfume não encontrado' 
            });
        }
        
        // Verifica se já avaliou
        const existingReview = await query(
            'SELECT id_avaliacao FROM avaliacao WHERE id_usuario = $1 AND id_perfume = $2',
            [id_usuario, perfumeId]
        );
        
        if (existingReview.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Você já avaliou este perfume. Use PUT para atualizar.' 
            });
        }
        
        // Cria avaliação
        const result = await query(
            `INSERT INTO avaliacao (id_usuario, id_perfume, rating, comentario) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [id_usuario, perfumeId, rating, comentario]
        );
        
        res.status(201).json({
            message: 'Avaliação criada com sucesso!',
            avaliacao: result.rows[0]
        });
        
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        
        if (error.code === '23505') { // Violação de unique constraint
            return res.status(400).json({ 
                error: 'Você já avaliou este perfume' 
            });
        }
        
        res.status(500).json({ 
            error: 'Erro ao criar avaliação' 
        });
    }
};

/**
 * Atualizar avaliação
 * PUT /api/avaliacoes/:avaliacaoId
 */
const updateAvaliacao = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { avaliacaoId } = req.params;
        const { rating, comentario } = req.body;
        
        // Verifica se a avaliação pertence ao usuário
        const avaliacao = await query(
            'SELECT * FROM avaliacao WHERE id_avaliacao = $1 AND id_usuario = $2',
            [avaliacaoId, id_usuario]
        );
        
        if (avaliacao.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Avaliação não encontrada ou você não tem permissão' 
            });
        }
        
        // Atualiza
        const result = await query(
            `UPDATE avaliacao 
             SET rating = $1, comentario = $2, data_avaliacao = NOW()
             WHERE id_avaliacao = $3 
             RETURNING *`,
            [rating, comentario, avaliacaoId]
        );
        
        res.json({
            message: 'Avaliação atualizada com sucesso!',
            avaliacao: result.rows[0]
        });
        
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        res.status(500).json({ 
            error: 'Erro ao atualizar avaliação' 
        });
    }
};

/**
 * Deletar avaliação
 * DELETE /api/avaliacoes/:avaliacaoId
 */
const deleteAvaliacao = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { avaliacaoId } = req.params;
        
        const result = await query(
            'DELETE FROM avaliacao WHERE id_avaliacao = $1 AND id_usuario = $2 RETURNING *',
            [avaliacaoId, id_usuario]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Avaliação não encontrada' 
            });
        }
        
        res.json({
            message: 'Avaliação deletada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        res.status(500).json({ 
            error: 'Erro ao deletar avaliação' 
        });
    }
};

/**
 * Buscar minhas avaliações
 * GET /api/avaliacoes/minhas
 */
const getMinhasAvaliacoes = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        
        const result = await query(`
            SELECT 
                a.*,
                p.nome as perfume_nome,
                p.imagem_url,
                m.nome as marca_nome
            FROM avaliacao a
            JOIN perfume p ON a.id_perfume = p.id_perfume
            JOIN marca m ON p.id_marca = m.id_marca
            WHERE a.id_usuario = $1
            ORDER BY a.data_avaliacao DESC
        `, [id_usuario]);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar suas avaliações' 
        });
    }
};

module.exports = {
    getAvaliacoesByPerfume,
    createAvaliacao,
    updateAvaliacao,
    deleteAvaliacao,
    getMinhasAvaliacoes
};