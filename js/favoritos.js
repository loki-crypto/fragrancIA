/* ==========================================================================
   LÓGICA DA PÁGINA DE FAVORITOS
   ========================================================================== */

// Dados dos perfumes (mesmo do results.js)
const perfumesData = {
  "tobacco-vanille": {
    id: "tobacco-vanille",
    name: "Tom Ford Tobacco Vanille",
    brand: "Tom Ford",
    image: "../images/perfumes/tom-ford-tobacco-vanille.png",
  },
  "baccarat-rouge": {
    id: "baccarat-rouge",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    image: "../images/perfumes/baccarat-rouge-540.png",
  },
  "nishane-ani": {
    id: "nishane-ani",
    name: "Nishane Ani",
    brand: "Nishane",
    image: "../images/perfumes/nishane-ani.png",
  },
};

let currentRemoveId = null;

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  setupEventListeners();
});

/**
 * Carrega e exibe os favoritos
 */
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const grid = document.getElementById("favorites-grid");
  const emptyState = document.getElementById("empty-state");

  if (favorites.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
    updateStats(0, 0);
    return;
  }

  grid.style.display = "grid";
  emptyState.style.display = "none";
  grid.innerHTML = "";

  // Conta marcas únicas
  const brands = new Set();

  favorites.forEach((perfumeId) => {
    const perfume = perfumesData[perfumeId];
    if (!perfume) return;

    brands.add(perfume.brand);

    const card = createFavoriteCard(perfume);
    grid.appendChild(card);
  });

  updateStats(favorites.length, brands.size);
}

/**
 * Cria um card de favorito
 * @param {Object} perfume - Dados do perfume
 * @returns {HTMLElement}
 */
function createFavoriteCard(perfume) {
  const card = document.createElement("div");
  card.className = "favorite-card";
  card.dataset.perfumeId = perfume.id;

  // Data de adição (simula)
  const addedDate = new Date().toLocaleDateString("pt-BR");

  card.innerHTML = `
        <button class="remove-favorite-btn" onclick="confirmRemove('${perfume.id}')">
            <i class="fas fa-times"></i>
        </button>
        <img src="${perfume.image}" alt="${perfume.name}">
        <div class="favorite-info">
            <h3>${perfume.name}</h3>
            <span class="brand">${perfume.brand}</span>
            <span class="added-date">
                <i class="fas fa-calendar-plus"></i>
                Adicionado em ${addedDate}
            </span>
        </div>
        <button class="view-btn" onclick="viewDetails('${perfume.id}')">
            <i class="fas fa-eye"></i>
            Ver Detalhes
        </button>
    `;

  return card;
}

/**
 * Atualiza as estatísticas
 * @param {number} total - Total de favoritos
 * @param {number} brands - Total de marcas
 */
function updateStats(total, brands) {
  document.getElementById("total-favorites").textContent = total;
  document.getElementById("total-brands").textContent = brands;
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
  // Ordenação
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    sortFavorites(e.target.value);
  });

  // Limpar todos
  const clearAllBtn = document.getElementById("clear-all-btn");
  clearAllBtn.addEventListener("click", confirmClearAll);

  // Modais
  document
    .getElementById("cancel-remove")
    .addEventListener("click", closeRemoveModal);
  document
    .getElementById("confirm-remove")
    .addEventListener("click", removeFromFavorites);
  document
    .getElementById("cancel-clear")
    .addEventListener("click", closeClearModal);
  document
    .getElementById("confirm-clear")
    .addEventListener("click", clearAllFavorites);

  // Fechar modal ao clicar no backdrop
  document.getElementById("confirm-backdrop").addEventListener("click", () => {
    closeRemoveModal();
    closeClearModal();
  });
}

/**
 * Ordena os favoritos
 * @param {string} sortType - Tipo de ordenação
 */
function sortFavorites(sortType) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const grid = document.getElementById("favorites-grid");
  const cards = Array.from(grid.children);

  cards.sort((a, b) => {
    const idA = a.dataset.perfumeId;
    const idB = b.dataset.perfumeId;
    const perfumeA = perfumesData[idA];
    const perfumeB = perfumesData[idB];

    switch (sortType) {
      case "name":
        return perfumeA.name.localeCompare(perfumeB.name);
      case "brand":
        return perfumeA.brand.localeCompare(perfumeB.brand);
      case "recent":
      default:
        return favorites.indexOf(idB) - favorites.indexOf(idA);
    }
  });

  grid.innerHTML = "";
  cards.forEach((card) => grid.appendChild(card));
}

/**
 * Confirma remoção de um favorito
 * @param {string} perfumeId - ID do perfume
 */
function confirmRemove(perfumeId) {
  currentRemoveId = perfumeId;
  document.getElementById("confirm-backdrop").classList.remove("hidden");
  document.getElementById("confirm-modal").classList.remove("hidden");
}

/**
 * Remove um favorito
 */
function removeFromFavorites() {
  if (!currentRemoveId) return;

  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites = favorites.filter((id) => id !== currentRemoveId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  closeRemoveModal();
  loadFavorites();
  showNotification("Perfume removido dos favoritos!", "success");
  currentRemoveId = null;
}

/**
 * Fecha modal de remoção
 */
function closeRemoveModal() {
  document.getElementById("confirm-backdrop").classList.add("hidden");
  document.getElementById("confirm-modal").classList.add("hidden");
}

/**
 * Confirma limpar todos os favoritos
 */
function confirmClearAll() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.length === 0) {
    showNotification("Você não tem favoritos para remover", "info");
    return;
  }

  document.getElementById("confirm-backdrop").classList.remove("hidden");
  document.getElementById("clear-all-modal").classList.remove("hidden");
}

/**
 * Limpa todos os favoritos
 */
function clearAllFavorites() {
  localStorage.setItem("favorites", "[]");
  closeClearModal();
  loadFavorites();
  showNotification("Todos os favoritos foram removidos!", "success");
}

/**
 * Fecha modal de limpar tudo
 */
function closeClearModal() {
  document.getElementById("confirm-backdrop").classList.add("hidden");
  document.getElementById("clear-all-modal").classList.add("hidden");
}

/**
 * Visualiza detalhes do perfume
 * @param {string} perfumeId - ID do perfume
 */
function viewDetails(perfumeId) {
  // Redireciona para a página de resultados
  window.location.href = "resultados.html";
}

/**
 * Mostra notificação
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (success, error, info)
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: 500;
        max-width: 350px;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Retorna cor da notificação
 */
function getNotificationColor(type) {
  const colors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
  };
  return colors[type] || colors.info;
}

/**
 * Retorna ícone da notificação
 */
function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    info: "info-circle",
  };
  return icons[type] || icons.info;
}

// Adiciona animações
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
