/**
 * Controller de Quiz
 */

const { query } = require('../config/database');

/**
 * Salvar respostas do quiz
 * POST /api/quiz
 */
const saveQuiz = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        const { periodo, evento, familia, intensidade, impressao } = req.body;
        
        // Validação básica
        if (!periodo || !evento || !familia || !intensidade || !impressao) {
            return res.status(400).json({ 
                error: 'Todas as respostas são obrigatórias' 
            });
        }
        
        // Salva as respostas
        const result = await query(
            `INSERT INTO quiz_resposta 
                (id_usuario, periodo, evento, familia, intensidade, impressao) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [id_usuario, periodo, evento, familia, intensidade, impressao]
        );
        
        const quizId = result.rows[0].id_quiz;
        
        // Busca recomendações baseadas nas respostas
        const recomendacoes = await getRecomendacoes(
            periodo, evento, familia, intensidade, impressao
        );
        
        res.status(201).json({
            message: 'Quiz salvo com sucesso!',
            quiz_id: quizId,
            recomendacoes
        });
        
    } catch (error) {
        console.error('Erro ao salvar quiz:', error);
        res.status(500).json({ 
            error: 'Erro ao salvar quiz' 
        });
    }
};

/**
 * Buscar histórico de quizzes do usuário
 * GET /api/quiz/historico
 */
const getHistorico = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        
        const result = await query(
            `SELECT * FROM quiz_resposta 
             WHERE id_usuario = $1 
             ORDER BY data_quiz DESC`,
            [id_usuario]
        );
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar histórico de quizzes' 
        });
    }
};

/**
 * Buscar último quiz do usuário
 * GET /api/quiz/ultimo
 */
const getUltimoQuiz = async (req, res) => {
    try {
        const { id_usuario } = req.user;
        
        const result = await query(
            `SELECT * FROM quiz_resposta 
             WHERE id_usuario = $1 
             ORDER BY data_quiz DESC 
             LIMIT 1`,
            [id_usuario]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Nenhum quiz encontrado' 
            });
        }
        
        res.json(result.rows[0]);
        
    } catch (error) {
        console.error('Erro ao buscar quiz:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar quiz' 
        });
    }
};

/**
 * Lógica de recomendação baseada nas respostas
 * (Simplificada - pode ser melhorada com ML)
 */
async function getRecomendacoes(periodo, evento, familia, intensidade, impressao) {
    try {
        let sql = `
            SELECT 
                p.id_perfume,
                p.nome,
                p.descricao,
                p.imagem_url,
                p.longevidade,
                p.sillage,
                p.preco_min,
                p.preco_max,
                m.nome as marca_nome,
                COALESCE(AVG(a.rating), 0) as rating_medio
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            LEFT JOIN avaliacao a ON p.id_perfume = a.id_perfume
            WHERE p.ativo = true
        `;
        
        const conditions = [];
        
        // Filtro por período/ocasião
        if (periodo.includes('noite') || evento.includes('especial')) {
            conditions.push("p.ocasiao ILIKE '%noite%' OR p.ocasiao ILIKE '%especial%'");
        }
        
        // Filtro por intensidade
        if (intensidade.includes('marcante') || intensidade.includes('duradouro')) {
            conditions.push("p.sillage ILIKE '%forte%'");
        } else if (intensidade.includes('discreto')) {
            conditions.push("p.sillage ILIKE '%moderado%' OR p.sillage ILIKE '%leve%'");
        }
        
        if (conditions.length > 0) {
            sql += ' AND (' + conditions.join(' OR ') + ')';
        }
        
        sql += `
            GROUP BY p.id_perfume, m.nome
            ORDER BY rating_medio DESC
            LIMIT 3
        `;
        
        const result = await query(sql);
        
        // Se não encontrou resultados, retorna os mais populares
        if (result.rows.length === 0) {
            const popular = await query(`
                SELECT 
                    p.id_perfume,
                    p.nome,
                    p.descricao,
                    p.imagem_url,
                    m.nome as marca_nome
                FROM perfume p
                JOIN marca m ON p.id_marca = m.id_marca
                WHERE p.ativo = true
                ORDER BY p.id_perfume
                LIMIT 3
            `);
            
            return popular.rows;
        }
        
        return result.rows;
        
    } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        return [];
    }
}

module.exports = {
    saveQuiz,
    getHistorico,
    getUltimoQuiz
};