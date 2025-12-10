/* ==========================================================================
   LÓGICA DA PÁGINA DE PERFIL - INTEGRADO COM API
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeProfilePage();
});

async function initializeProfilePage() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  await loadUserData();
  setupNavigation();
  setupFormHandlers();
  loadFavorites();
  loadQuizHistory();
}

/**
 * Carrega os dados do usuário da API
 */
async function loadUserData() {
  try {
    // BUSCA DA API
    const userData = await api.get('/auth/me');
    
    // Atualiza localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Atualiza UI
    updateUserInfo(userData);
    updateUserAvatar(userData);
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    
    // Se token expirou, redireciona
    if (error.message.includes('Token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  }
}

/**
 * Atualiza as informações do usuário na UI
 */
function updateUserInfo(userData) {
  const nameElement = document.getElementById("user-name");
  const emailElement = document.getElementById("user-email");
  const editNameInput = document.getElementById("edit-name");
  const editEmailInput = document.getElementById("edit-email");

  if (nameElement) nameElement.textContent = userData.nome;
  if (emailElement) emailElement.textContent = userData.email;
  if (editNameInput) editNameInput.value = userData.nome;
  if (editEmailInput) editEmailInput.value = userData.email;
}

/**
 * Atualiza o avatar do usuário
 */
function updateUserAvatar(userData) {
  if (!userData.nome) return;

  const initials = userData.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const profileAvatar = document.getElementById("profile-avatar");
  if (profileAvatar) profileAvatar.textContent = initials;

  const navAvatar = document.getElementById("nav-avatar");
  if (navAvatar) navAvatar.textContent = initials;
}

/**
 * Configura a navegação entre seções
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll(".perfil-nav a");
  const sections = document.querySelectorAll(".perfil-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const sectionName = link.dataset.section;

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((section) => {
        section.style.display = "none";
      });

      const targetSection = document.getElementById(`section-${sectionName}`);
      if (targetSection) {
        targetSection.style.display = "block";
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/**
 * Configura os manipuladores de formulários
 */
function setupFormHandlers() {
  const editForm = document.getElementById("edit-profile-form");
  if (editForm) {
    editForm.addEventListener("submit", handleProfileUpdate);
  }

  const cancelBtn = editForm?.querySelector(".btn-secondary");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", handleCancel);
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Manipula o cancelamento da edição
 */
function handleCancel(e) {
  e.preventDefault();

  if (confirm("Deseja descartar as alterações?")) {
    loadUserData();
    showNotification("Alterações descartadas", "info");
  }
}

/**
 * Manipula a atualização do perfil
 */
async function handleProfileUpdate(e) {
  e.preventDefault();

  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;

  if (!name || name.length < 3) {
    showNotification("O nome deve ter no mínimo 3 caracteres", "error");
    return;
  }

  if (!validateEmail(email)) {
    showNotification("Por favor, insira um email válido", "error");
    return;
  }

  // AQUI VOCÊ PODE ADICIONAR ROTA DE UPDATE NO BACKEND
  // Por enquanto, só atualiza localmente
  showNotification("Perfil atualizado! (update API não implementado ainda)", "info");
}

/**
 * Valida formato de email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Manipula o logout
 */
function handleLogout(e) {
  e.preventDefault();

  if (confirm("Deseja realmente sair da sua conta?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "../index.html";
  }
}

/**
 * Carrega e exibe os favoritos
 */
async function loadFavorites() {
  const token = localStorage.getItem('token');
  
  if (!token) return;
  
  try {
    const favoritos = await api.get('/favoritos');
    
    const favoritesStat = document.querySelector(".stat-card h4");
    if (favoritesStat) {
      favoritesStat.textContent = favoritos.length;
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
  }
}

/**
 * Carrega histórico de quizzes
 */
async function loadQuizHistory() {
  const token = localStorage.getItem('token');
  
  if (!token) return;
  
  try {
    const quizzes = await api.get('/quiz/historico');
    
    const quizzesStat = document.querySelectorAll(".stat-card h4")[1];
    if (quizzesStat) {
      quizzesStat.textContent = quizzes.length;
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  }
}

/**
 * Mostra uma notificação
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: ${getNotificationColor(type)};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function getNotificationColor(type) {
  const colors = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
  };
  return colors[type] || colors.info;
}