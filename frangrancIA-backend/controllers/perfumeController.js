/**
 * Controller de Perfumes
 */

const { query } = require('../config/database');

/**
 * Listar todos os perfumes
 * GET /api/perfumes
 */
const getAllPerfumes = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                p.*,
                m.nome as marca_nome,
                m.pais as marca_pais,
                COALESCE(AVG(a.rating), 0) as rating_medio,
                COUNT(DISTINCT a.id_avaliacao) as total_avaliacoes,
                COUNT(DISTINCT f.id_usuario) as total_favoritos
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            LEFT JOIN avaliacao a ON p.id_perfume = a.id_perfume
            LEFT JOIN favorito f ON p.id_perfume = f.id_perfume
            WHERE p.ativo = true
            GROUP BY p.id_perfume, m.id_marca
            ORDER BY p.nome
        `);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar perfumes:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar perfumes' 
        });
    }
};

/**
 * Buscar perfume por ID
 * GET /api/perfumes/:id
 */
const getPerfumeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Busca perfume com marca
        const perfumeResult = await query(`
            SELECT 
                p.*,
                m.nome as marca_nome,
                m.pais as marca_pais,
                m.descricao as marca_descricao,
                COALESCE(AVG(a.rating), 0) as rating_medio,
                COUNT(DISTINCT a.id_avaliacao) as total_avaliacoes
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            LEFT JOIN avaliacao a ON p.id_perfume = a.id_perfume
            WHERE p.id_perfume = $1 AND p.ativo = true
            GROUP BY p.id_perfume, m.id_marca
        `, [id]);
        
        if (perfumeResult.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Perfume não encontrado' 
            });
        }
        
        const perfume = perfumeResult.rows[0];
        
        // Busca notas olfativas
        const notasResult = await query(`
            SELECT 
                n.id_nota,
                n.nome,
                n.tipo,
                pn.intensidade
            FROM perfume_nota pn
            JOIN nota_olfativa n ON pn.id_nota = n.id_nota
            WHERE pn.id_perfume = $1
            ORDER BY 
                CASE n.tipo 
                    WHEN 'Topo' THEN 1 
                    WHEN 'Coração' THEN 2 
                    WHEN 'Fundo' THEN 3 
                END
        `, [id]);
        
        perfume.notas = notasResult.rows;
        
        res.json(perfume);
        
    } catch (error) {
        console.error('Erro ao buscar perfume:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar perfume' 
        });
    }
};

/**
 * Buscar perfumes por filtros
 * GET /api/perfumes/search?genero=unissex&marca=1
 */
const searchPerfumes = async (req, res) => {
    try {
        const { genero, marca, preco_max, estacao } = req.query;
        
        let sql = `
            SELECT 
                p.*,
                m.nome as marca_nome,
                COALESCE(AVG(a.rating), 0) as rating_medio
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            LEFT JOIN avaliacao a ON p.id_perfume = a.id_perfume
            WHERE p.ativo = true
        `;
        
        const params = [];
        let paramCount = 1;
        
        if (genero) {
            sql += ` AND LOWER(p.genero) = LOWER($${paramCount})`;
            params.push(genero);
            paramCount++;
        }
        
        if (marca) {
            sql += ` AND p.id_marca = $${paramCount}`;
            params.push(marca);
            paramCount++;
        }
        
        if (preco_max) {
            sql += ` AND p.preco_min <= $${paramCount}`;
            params.push(preco_max);
            paramCount++;
        }
        
        if (estacao) {
            sql += ` AND p.estacao ILIKE $${paramCount}`;
            params.push(`%${estacao}%`);
            paramCount++;
        }
        
        sql += ' GROUP BY p.id_perfume, m.id_marca ORDER BY p.nome';
        
        const result = await query(sql, params);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar perfumes:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar perfumes' 
        });
    }
};

/**
 * Perfumes mais populares
 * GET /api/perfumes/populares
 */
const getPopulares = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                p.id_perfume,
                p.nome,
                p.imagem_url,
                m.nome as marca_nome,
                COUNT(f.id_usuario) as total_favoritos,
                COALESCE(AVG(a.rating), 0) as rating_medio
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            LEFT JOIN favorito f ON p.id_perfume = f.id_perfume
            LEFT JOIN avaliacao a ON p.id_perfume = a.id_perfume
            WHERE p.ativo = true
            GROUP BY p.id_perfume, m.nome
            ORDER BY total_favoritos DESC, rating_medio DESC
            LIMIT 10
        `);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar populares:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar perfumes populares' 
        });
    }
};

// ... (código anterior do seu controller)

/**
 * Recomendações (Simulação para o Quiz)
 * GET /api/perfumes/recomendados
 */
const getRecomendations = async (req, res) => {
    try {
        // Seleciona 3 perfumes aleatórios com os dados da marca
        const result = await query(`
            SELECT 
                p.id_perfume,
                p.nome,
                p.descricao,
                p.imagem_url,
                p.genero,
                m.nome as nome_marca 
            FROM perfume p
            JOIN marca m ON p.id_marca = m.id_marca
            WHERE p.ativo = true
            ORDER BY RANDOM()
            LIMIT 3
        `);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar recomendações' 
        });
    }
};

module.exports = {
    getAllPerfumes,
    getPerfumeById,
    searchPerfumes,
    getPopulares,
    getRecomendations
};