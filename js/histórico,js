/* ==========================================================================
   LÓGICA DA PÁGINA DE HISTÓRICO
   ========================================================================== */

let currentFilter = "all";
let currentPeriod = "all";

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  loadHistory();
  setupEventListeners();
  updateStats();
});

/**
 * Configura event listeners
 */
function setupEventListeners() {
  // Filtros de tipo
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      filterHistory();
    });
  });

  // Filtro de período
  const periodSelect = document.getElementById("period-select");
  periodSelect.addEventListener("change", (e) => {
    currentPeriod = e.target.value;
    filterHistory();
  });

  // Modal
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document
    .getElementById("modal-backdrop")
    .addEventListener("click", closeModal);
}

/**
 * Carrega o histórico
 */
function loadHistory() {
  const timeline = document.getElementById("timeline");
  const emptyState = document.getElementById("empty-state");

  // Pega dados do localStorage
  const quizAnswers = localStorage.getItem("quizAnswers");
  const quizDate = localStorage.getItem("quizDate");
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const historyItems = [];

  // Adiciona quiz se existir
  if (quizAnswers && quizDate) {
    historyItems.push({
      type: "quiz",
      date: new Date(quizDate),
      title: "Quiz de Personalidade Olfativa",
      description:
        "Você completou nosso quiz personalizado e descobriu suas fragrâncias ideais.",
      results: ["3 perfumes recomendados", "5 perguntas respondidas"],
      data: JSON.parse(quizAnswers),
    });
  }

  // Adiciona favoritos (simula histórico de adição)
  favorites.forEach((perfumeId, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index); // Simula datas diferentes

    historyItems.push({
      type: "favorite",
      date: date,
      title: `Perfume adicionado aos favoritos`,
      description: `Você adicionou um novo perfume à sua coleção pessoal.`,
      perfumeId: perfumeId,
    });
  });

  // Ordena por data (mais recente primeiro)
  historyItems.sort((a, b) => b.date - a.date);

  if (historyItems.length === 0) {
    timeline.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  timeline.style.display = "block";
  emptyState.style.display = "none";

  renderTimeline(historyItems);
}

/**
 * Renderiza a timeline
 * @param {Array} items - Itens do histórico
 */
function renderTimeline(items) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  items.forEach((item, index) => {
    const timelineItem = createTimelineItem(item, index);
    timeline.appendChild(timelineItem);
  });
}

/**
 * Cria um item da timeline
 * @param {Object} item - Dados do item
 * @param {number} index - Índice
 * @returns {HTMLElement}
 */
function createTimelineItem(item, index) {
  const div = document.createElement("div");
  div.className = "timeline-item";
  div.dataset.type = item.type;
  div.dataset.date = item.date.toISOString();
  div.style.animationDelay = `${index * 0.1}s`;

  const typeIcon = item.type === "quiz" ? "fa-clipboard-check" : "fa-heart";
  const typeLabel = item.type === "quiz" ? "Quiz" : "Favorito";
  const formattedDate = formatDate(item.date);

  let resultsHTML = "";
  if (item.results) {
    resultsHTML = `
            <div class="timeline-results">
                ${item.results
                  .map((r) => `<span class="result-tag">${r}</span>`)
                  .join("")}
            </div>
        `;
  }

  let actionsHTML = "";
  if (item.type === "quiz") {
    actionsHTML = `
            <div class="timeline-actions">
                <button class="action-btn-small" onclick="viewQuizDetails('${item.date.toISOString()}')">
                    <i class="fas fa-eye"></i>
                    Ver Respostas
                </button>
                <button class="action-btn-small" onclick="window.location.href='resultados.html'">
                    <i class="fas fa-list"></i>
                    Ver Resultados
                </button>
            </div>
        `;
  } else if (item.type === "favorite") {
    actionsHTML = `
            <div class="timeline-actions">
                <button class="action-btn-small" onclick="window.location.href='favoritos.html'">
                    <i class="fas fa-heart"></i>
                    Ver Favoritos
                </button>
            </div>
        `;
  }

  div.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <div class="timeline-header">
                <span class="timeline-type">
                    <i class="fas ${typeIcon}"></i>
                    ${typeLabel}
                </span>
                <span class="timeline-date">
                    <i class="far fa-clock"></i>
                    ${formattedDate}
                </span>
            </div>
            <h3 class="timeline-title">${item.title}</h3>
            <p class="timeline-description">${item.description}</p>
            ${resultsHTML}
            ${actionsHTML}
        </div>
    `;

  return div;
}

/**
 * Formata data
 * @param {Date} date - Data
 * @returns {string}
 */
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return date.toLocaleDateString("pt-BR");
}

/**
 * Filtra o histórico
 */
function filterHistory() {
  const items = document.querySelectorAll(".timeline-item");
  let visibleCount = 0;

  items.forEach((item) => {
    const type = item.dataset.type;
    const date = new Date(item.dataset.date);

    // Filtro de tipo
    const typeMatch =
      currentFilter === "all" ||
      (currentFilter === "quizzes" && type === "quiz") ||
      (currentFilter === "favorites" && type === "favorite");

    // Filtro de período
    const periodMatch = checkPeriod(date);

    if (typeMatch && periodMatch) {
      item.style.display = "block";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });

  // Mostra estado vazio se necessário
  const timeline = document.getElementById("timeline");
  const emptyState = document.getElementById("empty-state");

  if (visibleCount === 0) {
    timeline.style.display = "none";
    emptyState.style.display = "block";
  } else {
    timeline.style.display = "block";
    emptyState.style.display = "none";
  }
}

/**
 * Verifica se a data está no período selecionado
 * @param {Date} date - Data
 * @returns {boolean}
 */
function checkPeriod(date) {
  if (currentPeriod === "all") return true;

  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  switch (currentPeriod) {
    case "week":
      return days <= 7;
    case "month":
      return days <= 30;
    case "year":
      return days <= 365;
    default:
      return true;
  }
}

/**
 * Atualiza estatísticas
 */
function updateStats() {
  // Conta quizzes
  const hasQuiz = localStorage.getItem("quizAnswers") ? 1 : 0;
  document.getElementById("total-quizzes").textContent = hasQuiz;

  // Conta perfumes descobertos (3 por quiz)
  const discovered = hasQuiz * 3;
  document.getElementById("total-recommendations").textContent = discovered;

  // Data de membro (simula)
  const memberDate = new Date();
  memberDate.setMonth(memberDate.getMonth() - 3); // 3 meses atrás
  const monthYear = memberDate.toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
  document.getElementById("member-since").textContent = monthYear;
}

/**
 * Visualiza detalhes do quiz
 * @param {string} dateString - Data do quiz
 */
function viewQuizDetails(dateString) {
  const quizData = JSON.parse(localStorage.getItem("quizAnswers") || "{}");
  const date = new Date(dateString);

  const modal = document.getElementById("details-modal");
  const backdrop = document.getElementById("modal-backdrop");
  const content = document.getElementById("modal-content");

  // Mapeia os nomes das perguntas para títulos legíveis
  const questionTitles = {
    periodo: "Período do dia",
    evento: "Tipo de evento",
    familia: "Família de aromas",
    intensidade: "Intensidade",
    impressao: "Impressão desejada",
  };

  let answersHTML = '<div style="display: grid; gap: 1rem;">';
  for (const [key, value] of Object.entries(quizData)) {
    const title = questionTitles[key] || key;
    const formattedValue = value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    answersHTML += `
            <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border-left: 3px solid #d4af37;">
                <strong style="color: #d4af37; display: block; margin-bottom: 0.5rem;">${title}</strong>
                <span style="color: #ccc;">${formattedValue}</span>
            </div>
        `;
  }
  answersHTML += "</div>";

  content.innerHTML = `
        <h2 style="color: #d4af37; margin-bottom: 1rem;">Detalhes do Quiz</h2>
        <p style="color: #aaa; margin-bottom: 2rem;">
            <i class="far fa-calendar"></i>
            Realizado em ${date.toLocaleDateString(
              "pt-BR"
            )} às ${date.toLocaleTimeString("pt-BR")}
        </p>
        <h3 style="color: #f4f4f4; margin-bottom: 1rem;">Suas Respostas:</h3>
        ${answersHTML}
        <div style="margin-top: 2rem;">
            <a href="resultados.html" class="btn btn-primary" style="width: 100%; display: block; text-align: center; padding: 1rem;">
                <i class="fas fa-eye"></i>
                Ver Recomendações
            </a>
        </div>
    `;

  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}

/**
 * Fecha o modal
 */
function closeModal() {
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("details-modal").classList.add("hidden");
}
