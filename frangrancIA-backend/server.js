/**
 * ============================================================================
 * FRAGANCIA API - Servidor Principal
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARES
// ============================================================================

// CORS - Permite requisições do frontend

//app.use(cors({
  //  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    //credentials: true
//}));

app.use(cors());

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================================================
// ROTAS
// ============================================================================

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Fragancia API está rodando!',
        timestamp: new Date().toISOString()
    });
});

// Importar rotas
const authRoutes = require('./routes/auth');
const perfumeRoutes = require('./routes/perfumes');
const favoritoRoutes = require('./routes/favoritos');
const quizRoutes = require('./routes/quiz');
const avaliacaoRoutes = require('./routes/avaliacoes');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);

// ============================================================================
// TRATAMENTO DE ERROS
// ============================================================================

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Rota não encontrada',
        path: req.path 
    });
});

// Erro global
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🌸 FRAGANCIA API                    ║
║                                        ║
║   🚀 Servidor rodando na porta ${PORT}   ║
║   �� http://localhost:${PORT}             ║
║   🗄️  PostgreSQL conectado             ║
║                                        ║
╚════════════════════════════════════════╝
    `);
    
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Modo: Desenvolvimento');
        console.log('📝 Docs: http://localhost:' + PORT + '/api/health\n');
    }
});
