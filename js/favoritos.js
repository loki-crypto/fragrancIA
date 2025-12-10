/* ==========================================================================
   LÓGICA DA PÁGINA DE FAVORITOS - INTEGRADO COM API
   ========================================================================== */

let currentRemoveId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadFavorites();
    setupEventListeners();
});

async function loadFavorites() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        showEmptyState();
        return;
    }
    
    try {
        const favoritos = await api.get('/favoritos');
        
        if (favoritos.length === 0) {
            showEmptyState();
            return;
        }
        
        displayFavorites(favoritos);
        updateStats(favoritos);
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        showNotification('Erro ao carregar favoritos', 'error');
        showEmptyState();
    }
}

function displayFavorites(favoritos) {
    const grid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    grid.innerHTML = '';
    
    favoritos.forEach(favorito => {
        const card = createFavoriteCard(favorito);
        grid.appendChild(card);
    });
}

function createFavoriteCard(favorito) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.dataset.perfumeId = favorito.id_perfume;
    
    const date = new Date(favorito.data_adicionado).toLocaleDateString('pt-BR');
    
    card.innerHTML = `
        <button class="remove-favorite-btn" onclick="confirmRemove(${favorito.id_perfume})">
            <i class="fas fa-times"></i>
        </button>
        <img src="${favorito.imagem_url}" alt="${favorito.nome}">
        <div class="favorite-info">
            <h3>${favorito.nome}</h3>
            <span class="brand">${favorito.marca_nome}</span>
            <span class="added-date">
                <i class="fas fa-calendar-plus"></i>
                Adicionado em ${date}
            </span>
        </div>
        <button class="view-btn" onclick="window.location.href='resultados.html'">
            <i class="fas fa-eye"></i>
            Ver Detalhes
        </button>
    `;
    
    return card;
}

function updateStats(favoritos) {
    const totalFav = favoritos.length;
    const brands = new Set(favoritos.map(f => f.marca_nome));
    
    document.getElementById('total-favorites').textContent = totalFav;
    document.getElementById('total-brands').textContent = brands.size;
}

function showEmptyState() {
    const grid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    updateStats([]);
}

function setupEventListeners() {
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        sortFavorites(e.target.value);
    });
    
    const clearAllBtn = document.getElementById('clear-all-btn');
    clearAllBtn.addEventListener('click', confirmClearAll);
    
    document.getElementById('cancel-remove').addEventListener('click', closeRemoveModal);
    document.getElementById('confirm-remove').addEventListener('click', removeFromFavorites);
    document.getElementById('cancel-clear').addEventListener('click', closeClearModal);
    document.getElementById('confirm-clear').addEventListener('click', clearAllFavorites);
    
    document.getElementById('confirm-backdrop').addEventListener('click', () => {
        closeRemoveModal();
        closeClearModal();
    });
}

function sortFavorites(sortType) {
    const grid = document.getElementById('favorites-grid');
    const cards = Array.from(grid.children);
    
    cards.sort((a, b) => {
        const nameA = a.querySelector('h3').textContent;
        const nameB = b.querySelector('h3').textContent;
        const brandA = a.querySelector('.brand').textContent;
        const brandB = b.querySelector('.brand').textContent;
        
        switch(sortType) {
            case 'name':
                return nameA.localeCompare(nameB);
            case 'brand':
                return brandA.localeCompare(brandB);
            case 'recent':
            default:
                return 0;
        }
    });
    
    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card));
}

function confirmRemove(perfumeId) {
    currentRemoveId = perfumeId;
    document.getElementById('confirm-backdrop').classList.remove('hidden');
    document.getElementById('confirm-modal').classList.remove('hidden');
}

async function removeFromFavorites() {
    if (!currentRemoveId) return;
    
    try {
        await api.delete(`/favoritos/${currentRemoveId}`);
        closeRemoveModal();
        await loadFavorites();
        showNotification('Perfume removido dos favoritos!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
    
    currentRemoveId = null;
}

function closeRemoveModal() {
    document.getElementById('confirm-backdrop').classList.add('hidden');
    document.getElementById('confirm-modal').classList.add('hidden');
}

function confirmClearAll() {
    const grid = document.getElementById('favorites-grid');
    if (grid.children.length === 0) {
        showNotification('Você não tem favoritos para remover', 'info');
        return;
    }
    
    document.getElementById('confirm-backdrop').classList.remove('hidden');
    document.getElementById('clear-all-modal').classList.remove('hidden');
}

async function clearAllFavorites() {
    const cards = document.querySelectorAll('.favorite-card');
    
    try {
        for (const card of cards) {
            const perfumeId = card.dataset.perfumeId;
            await api.delete(`/favoritos/${perfumeId}`);
        }
        
        closeClearModal();
        showEmptyState();
        showNotification('Todos os favoritos foram removidos!', 'success');
    } catch (error) {
        showNotification('Erro ao remover favoritos', 'error');
    }
}

function closeClearModal() {
    document.getElementById('confirm-backdrop').classList.add('hidden');
    document.getElementById('clear-all-modal').classList.add('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}