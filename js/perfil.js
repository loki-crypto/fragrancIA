/* ==========================================================================
   LÓGICA DA PÁGINA DE PERFIL
   ========================================================================== */

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initializeProfilePage();
});

/**
 * Inicializa a página de perfil
 */
function initializeProfilePage() {
    loadUserData();
    setupNavigation();
    setupFormHandlers();
}

/**
 * Carrega os dados do usuário
 */
function loadUserData() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        // Se não houver usuário logado, redireciona para login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const userData = JSON.parse(user);
        
        // Atualiza informações do usuário na página
        updateUserInfo(userData);
        updateUserAvatar(userData);
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

/**
 * Atualiza as informações do usuário na UI
 * @param {Object} userData - Dados do usuário
 */
function updateUserInfo(userData) {
    const nameElement = document.getElementById('user-name');
    const emailElement = document.getElementById('user-email');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    
    if (nameElement && userData.name) {
        nameElement.textContent = userData.name;
    }
    
    if (emailElement && userData.email) {
        emailElement.textContent = userData.email;
    }
    
    if (editNameInput && userData.name) {
        editNameInput.value = userData.name;
    }
    
    if (editEmailInput && userData.email) {
        editEmailInput.value = userData.email;
    }
}

/**
 * Atualiza o avatar do usuário
 * @param {Object} userData - Dados do usuário
 */
function updateUserAvatar(userData) {
    if (!userData.name) return;
    
    // Gera iniciais do nome
    const initials = userData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    // Atualiza avatar grande
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) {
        profileAvatar.textContent = initials;
    }
    
    // Atualiza avatar da navegação
    const navAvatar = document.getElementById('nav-avatar');
    if (navAvatar) {
        navAvatar.textContent = initials;
    }
}

/**
 * Configura a navegação entre seções
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.perfil-nav a');
    const sections = document.querySelectorAll('.perfil-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionName = link.dataset.section;
            
            // Remove active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona active ao link clicado
            link.classList.add('active');
            
            // Esconde todas as seções
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Mostra a seção selecionada
            const targetSection = document.getElementById(`section-${sectionName}`);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Rola para o topo da seção
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Configura os manipuladores de formulários
 */
function setupFormHandlers() {
    // Formulário de edição de perfil
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        editForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Manipula a atualização do perfil
 * @param {Event} e - Evento de submit
 */
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const birthdate = document.getElementById('edit-birthdate').value;
    
    // Validações
    if (!name || name.length < 3) {
        showNotification('O nome deve ter no mínimo 3 caracteres', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Por favor, insira um email válido', 'error');
        return;
    }
    
    // Atualiza os dados no localStorage
    const userData = {
        name,
        email,
        phone,
        birthdate,
        loggedIn: true
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Atualiza a UI
    updateUserInfo(userData);
    updateUserAvatar(userData);
    
    showNotification('Perfil atualizado com sucesso!', 'success');
}

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean}
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Manipula o logout
 * @param {Event} e - Evento de clique
 */
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Deseja realmente sair da sua conta?')) {
        // Remove dados do usuário
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        
        // Redireciona para a home
        window.location.href = '../index.html';
    }
}

/**
 * Carrega e exibe os favoritos
 */
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesGrid = document.querySelector('.favorites-grid');
    
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">
                Você ainda não tem perfumes favoritos. 
                <a href="quiz.html" style="color: var(--color-primary);">Faça o quiz</a> 
                para descobrir suas opções!
            </p>
        `;
        return;
    }
    
    // Atualiza contador de favoritos
    const favoritesStat = document.querySelector('.stat-card h4');
    if (favoritesStat) {
        favoritesStat.textContent = favorites.length;
    }
}

/**
 * Carrega histórico de quizzes
 */
function loadQuizHistory() {
    // Simula histórico de quizzes
    // Em uma aplicação real, esses dados viriam de um backend
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    
    // Se houver dados reais de quiz
    const quizAnswers = localStorage.getItem('quizAnswers');
    const quizDate = localStorage.getItem('quizDate');
    
    if (quizAnswers && quizDate && quizHistory.length === 0) {
        quizHistory.push({
            date: quizDate,
            type: 'Quiz Completo',
            results: 3
        });
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    }
    
    // Atualiza contador de quizzes
    const quizzesStat = document.querySelectorAll('.stat-card h4')[1];
    if (quizzesStat) {
        quizzesStat.textContent = quizHistory.length || 5;
    }
}

/**
 * Mostra uma notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Retorna a cor da notificação baseada no tipo
 * @param {string} type - Tipo da notificação
 * @returns {string} - Cor hexadecimal
 */
function getNotificationColor(type) {
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    return colors[type] || colors.info;
}

// Carrega dados adicionais ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadQuizHistory();
});