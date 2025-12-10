// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Helper para fazer requisições
const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        };
        
        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    },
    
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};
