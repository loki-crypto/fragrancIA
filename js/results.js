/* ==========================================================================
   LÓGICA DA PÁGINA DE RESULTADOS
   ========================================================================== */

const perfumesData = {
    'tobacco-vanille': {
        id: 'tobacco-vanille',
        name: 'Tom Ford Tobacco Vanille',
        brand: 'Tom Ford',
        // CORREÇÃO: Adicionado /perfumes/ ao caminho
        image: '../images/perfumes/tom-ford-tobacco-vanille.png', 
        description: 'Um Oriental Especiado quente e opulento.',
        fullDescription: 'Tobacco Vanille é uma fragrância luxuosa e opulenta da casa Tom Ford. A composição magistral combina a riqueza do tabaco com a doçura reconfortante da baunilha, criando uma experiência olfativa verdadeiramente única.',
        notes: {
            top: 'Folha de Tabaco, Especiarias',
            heart: 'Baunilha, Cacau, Flor de Tabaco',
            base: 'Frutas Secas, Notas Amadeiradas'
        },
        longevity: '8-12 horas',
        sillage: 'Forte',
        season: 'Outono/Inverno',
        occasion: 'Noite/Especial',
        price: 'R$ 1.200 - R$ 1.500'
    },
    'baccarat-rouge': {
        id: 'baccarat-rouge',
        name: 'Baccarat Rouge 540',
        brand: 'Maison Francis Kurkdjian',
        // CORREÇÃO: Adicionado /perfumes/ ao caminho
        image: '../images/perfumes/baccarat-rouge-540.png',
        description: 'Um Âmbar Floral radiante e sofisticado.',
        fullDescription: 'Baccarat Rouge 540 é uma das fragrâncias mais icônicas da perfumaria contemporânea. Sua luminosidade única e projeção incomparável o tornam instantaneamente reconhecível com notas de açafrão e âmbar.',
        notes: {
            top: 'Açafrão, Jasmim',
            heart: 'Madeira de Âmbar, Âmbar Cinzento',
            base: 'Resina de Abeto, Cedro'
        },
        longevity: '10-14 horas',
        sillage: 'Muito Forte',
        season: 'Todas as Estações',
        occasion: 'Versátil/Exclusivo',
        price: 'R$ 1.800 - R$ 2.200'
    },
    'nishane-ani': {
        id: 'nishane-ani',
        name: 'Nishane Ani',
        brand: 'Nishane',
        // CORREÇÃO: Adicionado /perfumes/ ao caminho
        image: '../images/perfumes/nishane-ani.png',
        description: 'Um Oriental Floral vibrante e misterioso.',
        fullDescription: 'Ani, da casa turca Nishane, é uma celebração de patrimônio e modernidade. Frequentemente citado como o melhor perfume de baunilha do mundo, equilibra o doce com especiarias cítricas vibrantes.',
        notes: {
            top: 'Gengibre, Bergamota, Pimenta Rosa',
            heart: 'Cardamomo, Rosa Turca, Groselha',
            base: 'Baunilha, Sândalo, Patchouli'
        },
        longevity: '8-10 horas',
        sillage: 'Moderado a Forte',
        season: 'Primavera/Outono',
        occasion: 'Dia/Noite',
        price: 'R$ 1.400 - R$ 1.700'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização básica
    checkFavorites();
});

/* --- FUNÇÕES DO MODAL --- */

function showModal(perfumeId) {
    const perfume = perfumesData[perfumeId];
    if (!perfume) return;

    const modalBackdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('perfume-modal');
    const modalContent = document.getElementById('modal-content');

    // Monta o HTML interno do modal
    modalContent.innerHTML = `
        <div class="modal-image">
            <img src="${perfume.image}" alt="${perfume.name}">
        </div>
        <div class="modal-info">
            <h2>${perfume.name}</h2>
            <h3>${perfume.brand}</h3>
            <p style="margin-bottom: 1.5rem; line-height: 1.6;">${perfume.fullDescription}</p>
            
            <div class="notes-detail">
                <h4 style="color: #d4af37; margin-bottom: 10px; text-transform: uppercase; font-size: 0.9rem;">Pirâmide Olfativa</h4>
                <ul>
                    <li><strong>Topo:</strong> ${perfume.notes.top}</li>
                    <li><strong>Coração:</strong> ${perfume.notes.heart}</li>
                    <li><strong>Fundo:</strong> ${perfume.notes.base}</li>
                </ul>
            </div>
            
            <div class="perfume-specs" style="margin-top: 1.5rem;">
                <p><strong>⏱️ Fixação:</strong> ${perfume.longevity}</p>
                <p><strong>💨 Projeção:</strong> ${perfume.sillage}</p>
                <p><strong>🌡️ Ocasião:</strong> ${perfume.occasion}</p>
            </div>
            
            <div class="card-actions" style="margin-top: 2rem;">
                <button class="action-btn" onclick="addToFavorites('${perfumeId}')">
                    <i class="${isFavorite(perfumeId) ? 'fas' : 'far'} fa-heart"></i>
                    ${isFavorite(perfumeId) ? 'Favoritado' : 'Favoritar'}
                </button>
            </div>
        </div>
    `;

    // Remove a classe hidden para mostrar
    modalBackdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Trava o scroll da página de trás
}

function closeModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modal = document.getElementById('perfume-modal');
    
    modalBackdrop.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Destrava o scroll
}

// Fechar modal ao clicar fora (no backdrop)
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* --- FUNÇÕES DE FAVORITOS --- */

function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(id);
}

function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
        alert('Removido dos favoritos!'); // Pode substituir por notificação mais bonita
    } else {
        favorites.push(id);
        alert('Adicionado aos favoritos!');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateAllFavoriteButtons(id);
}

function updateAllFavoriteButtons(id) {
    // Atualiza botões na página e no modal se estiver aberto
    const isFav = isFavorite(id);
    const btns = document.querySelectorAll(`button[onclick="addToFavorites('${id}')"]`);
    
    btns.forEach(btn => {
        btn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart"></i> ${isFav ? 'Favoritado' : 'Favoritar'}`;
    });
}

function checkFavorites() {
    Object.keys(perfumesData).forEach(id => updateAllFavoriteButtons(id));
}

function shareProduct(id) {
    alert(`Compartilhando ${perfumesData[id].name}... (Link copiado!)`);
}