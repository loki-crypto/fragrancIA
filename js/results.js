/* ==========================================================================
   LÓGICA DA PÁGINA DE RESULTADOS - ATUALIZADO (TOAST + TOGGLE VISUAL)
   ========================================================================== */

// Variável global para guardar os IDs dos perfumes que o usuário já favoritou
let idsFavoritos = []; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Primeiro carregamos a lista de favoritos do usuário (se estiver logado)
    await carregarListaFavoritos();
    
    // 2. Depois carregamos os perfumes da vitrine
    await loadPerfumesFromAPI();
    
    setupModalListeners();
});

// --- NOVO: Função para pegar IDs dos favoritos atuais ---
async function carregarListaFavoritos() {
    const token = localStorage.getItem('token');
    if (!token) return; // Se não tem login, não tem favoritos

    try {
        const favoritos = await api.get('/favoritos');
        // Cria um array só com os IDs: [10, 25, 3]
        idsFavoritos = favoritos.map(f => f.id_perfume); 
    } catch (error) {
        console.warn('Erro ao carregar favoritos iniciais:', error);
    }
}

// --- NOVO: Função da Notificação Toast (Visual Bonito) ---
function mostrarToast(mensagem, tipo = 'sucesso') {
    const toast = document.getElementById("toast-container");
    if(!toast) return; // Segurança caso esqueça de por a div no HTML

    toast.innerText = mensagem;
    toast.className = "mostrar " + tipo; // Adiciona classe 'mostrar' e 'sucesso'/'removido'

    // Remove a notificação após 3 segundos
    setTimeout(() => { 
        toast.className = toast.className.replace("mostrar", ""); 
    }, 3000);
}

/**
 * Carrega perfumes da API
 */
async function loadPerfumesFromAPI() {
    const resultsGrid = document.querySelector('.results-grid');
    
    if (resultsGrid) {
        resultsGrid.innerHTML = '<p style="color: #d4af37; text-align: center; grid-column: 1/-1; padding: 2rem;">Carregando suas recomendações...</p>';
    }

    try {
        const perfumes = await api.get('/perfumes/recomendados');
        
        if (resultsGrid) resultsGrid.innerHTML = '';

        if (perfumes && perfumes.length > 0) {
            createPerfumeCards(perfumes, resultsGrid);
        } else {
            resultsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Nenhum perfume encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar perfumes:', error);
        if (resultsGrid) {
            resultsGrid.innerHTML = '<p style="color: red; text-align: center; grid-column: 1/-1;">Erro ao conectar com o servidor.</p>';
        }
    }
}

/**
 * Cria o HTML dos cards e injeta na tela
 */
function createPerfumeCards(perfumes, container) {
    perfumes.forEach((perfume, index) => {
        const match = 95 - (index * 4);

        let imgSrc = perfume.imagem_url;
        if (imgSrc && imgSrc.startsWith('/')) {
            imgSrc = `..${imgSrc}`;
        }

        // --- ALTERADO: Verifica se este perfume já é favorito ---
        const isFavorito = idsFavoritos.includes(perfume.id_perfume);
        
        // Define classes CSS baseado no estado inicial
        const btnClass = isFavorito ? 'action-btn btn-favorito favoritado' : 'action-btn btn-favorito';
        const iconClass = isFavorito ? 'fas fa-heart' : 'far fa-heart'; // Solid vs Regular

        const cardHTML = `
            <div class="perfume-card" data-perfume-id="${perfume.id_perfume}">
                <span class="match-badge">${match}% Match</span>
                <img 
                    src="${imgSrc}" 
                    alt="${perfume.nome}" 
                    onerror="this.src='../images/placeholder.png'"
                >
                <div class="perfume-info">
                    <h3>${perfume.nome}</h3>
                    <p class="brand">${perfume.nome_marca || 'Marca Exclusiva'}</p>
                    <p class="description">${perfume.descricao || 'Sem descrição.'}</p>
                    
                    <div class="card-actions">
                        <button class="${btnClass}" onclick="handleFavoriteToggle(this, ${perfume.id_perfume})">
                            <i class="${iconClass}"></i> Favoritar
                        </button>
                        
                        <button class="action-btn" onclick="shareProduct(${perfume.id_perfume})">
                            <i class="fas fa-share-alt"></i> Compartilhar
                        </button>
                    </div>
                    
                    <button class="view-details-btn" onclick="showModal(${perfume.id_perfume})">
                        Ver Detalhes Completos
                    </button>
                </div>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

/* ==========================================================================
   AÇÕES DE USUÁRIO (LÓGICA VISUAL E API)
   ========================================================================== */

// --- NOVO: Função Inteligente de Toggle ---
async function handleFavoriteToggle(btnElement, perfumeId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        mostrarToast('Faça login para favoritar!', 'erro'); // Usa 'erro' se quiser pintar de vermelho
        // Opcional: redirecionar para login
        return;
    }

    // 1. Identificar estado ATUAL pelo visual (classe CSS)
    const isCurrentlyFavorited = btnElement.classList.contains('favoritado');
    const icon = btnElement.querySelector('i');

    // 2. Mudar o visual IMEDIATAMENTE (Feedback rápido para o usuário)
    if (isCurrentlyFavorited) {
        // Estava favoritado -> Vamos remover
        btnElement.classList.remove('favoritado');
        icon.classList.remove('fas'); // Remove solid
        icon.classList.add('far');    // Adiciona regular
        mostrarToast('Removido dos favoritos.', 'removido'); // Toast Cinza/Vermelho
        
        // Atualiza nossa lista local
        idsFavoritos = idsFavoritos.filter(id => id !== perfumeId);

        // Chama API para DELETAR
        try {
            await api.delete(`/favoritos/${perfumeId}`); 
        } catch (error) {
            console.error('Erro ao remover', error);
            // Se der erro, reverte o visual? (Opcional)
        }

    } else {
        // Não estava favoritado -> Vamos adicionar
        btnElement.classList.add('favoritado');
        icon.classList.remove('far'); // Remove regular
        icon.classList.add('fas');    // Adiciona solid
        mostrarToast('Adicionado aos favoritos!', 'sucesso'); // Toast Verde
        
        // Atualiza lista local
        idsFavoritos.push(perfumeId);

        // Chama API para ADICIONAR
        try {
            await api.post(`/favoritos/${perfumeId}`);
        } catch (error) {
            console.error('Erro ao adicionar', error);
        }
    }
}

// Mantivemos a função de compartilhar simples
function shareProduct(perfumeId) {
    // Aqui também poderia ser um Toast ;)
    navigator.clipboard.writeText(`Confira este perfume: perfume-id-${perfumeId}`);
    mostrarToast('Link copiado para a área de transferência!', 'sucesso');
}

/* ==========================================================================
   FUNÇÕES DO MODAL (Mantidas, apenas ajeitando a chamada do botão lá dentro)
   ========================================================================== */

function setupModalListeners() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.querySelector('.close-modal-btn');
    
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

async function showModal(perfumeId) {
    try {
        const perfume = await api.get(`/perfumes/${perfumeId}`);
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modal = document.getElementById('perfume-modal');
        const modalContent = document.getElementById('modal-content');
        
        // Verifica se tá na lista global de favoritos
        const isFav = idsFavoritos.includes(perfumeId);

        let imgSrc = perfume.imagem_url;
        if (imgSrc && imgSrc.startsWith('/')) {
            imgSrc = `..${imgSrc}`;
        }
        
        // Define classes pro botão do MODAL
        const modalBtnClass = isFav ? 'action-btn favoritado' : 'action-btn';
        const modalIconClass = isFav ? 'fas fa-heart' : 'far fa-heart';

        modalContent.innerHTML = `
            <div class="modal-image">
                <img src="${imgSrc}" alt="${perfume.nome}" onerror="this.src='../images/placeholder.png'">
            </div>
            <div class="modal-info">
                <h2>${perfume.nome}</h2>
                <h3>${perfume.nome_marca || perfume.marca_nome}</h3>
                <p class="modal-desc">${perfume.descricao}</p>
                
                <div class="perfume-specs">
                    <p><strong>🌡️ Estação:</strong> ${perfume.estacao || 'Várias'}</p>
                    <p><strong>🎯 Ocasião:</strong> ${perfume.ocasiao || 'Versátil'}</p>
                    <p><strong>💰 Preço:</strong> R$ ${perfume.preco_min || '0'} - R$ ${perfume.preco_max || '0'}</p>
                </div>
                
                <div class="card-actions modal-actions">
                    <button class="${modalBtnClass}" onclick="handleFavoriteToggle(this, ${perfumeId})">
                        <i class="${modalIconClass}"></i> 
                        Favoritar
                    </button>
                </div>
            </div>
        `;
        
        modalBackdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        mostrarToast('Erro ao carregar detalhes.', 'removido');
    }
}

function closeModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('perfume-modal');
    
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Opcional: recarregar o grid ao fechar o modal caso tenha mudado algo, 
    // mas com a lógica visual acima nem precisa!
}