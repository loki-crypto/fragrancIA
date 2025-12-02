/* ==========================================================================
   LÓGICA DE AUTENTICAÇÃO (LOGIN E CADASTRO)
   ========================================================================== */

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthPage();
});

/**
 * Inicializa a página de autenticação
 */
function initializeAuthPage() {
    setupPasswordToggle();
    setupFormValidation();
    setupSocialButtons();
}

/**
 * Configura o toggle de visualização de senha
 */
function setupPasswordToggle() {
    // Toggle para campo de senha principal
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            togglePasswordVisibility(passwordInput, togglePassword);
        });
    }
    
    // Toggle para confirmar senha (página de cadastro)
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
        });
    }
}

/**
 * Alterna visibilidade da senha
 * @param {HTMLInputElement} input - Campo de input
 * @param {HTMLElement} icon - Ícone do olho
 */
function togglePasswordVisibility(input, icon) {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // Alterna o ícone
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

/**
 * Configura validação dos formulários
 */
function setupFormValidation() {
    // Formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        setupPasswordMatch();
    }
}

/**
 * Manipula o envio do formulário de login
 * @param {Event} e - Evento de submit
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validação básica
    if (!validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter no mínimo 6 caracteres.', 'error');
        return;
    }
    
    // Simula autenticação (substitua por chamada real à API)
    authenticateUser(email, password, remember);
}

/**
 * Manipula o envio do formulário de cadastro
 * @param {Event} e - Evento de submit
 */
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    // Validações
    if (name.trim().length < 3) {
        showMessage('O nome deve ter no mínimo 3 caracteres.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('A senha deve ter no mínimo 8 caracteres.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem.', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('Você deve aceitar os termos e condições.', 'error');
        return;
    }
    
    // Simula cadastro (substitua por chamada real à API)
    registerUser(name, email, password);
}

/**
 * Configura validação em tempo real das senhas
 */
function setupPasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value && password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('As senhas não coincidem');
            } else {
                confirmPassword.setCustomValidity('');
            }
        });
    }
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
 * Autentica o usuário (simulação)
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {boolean} remember - Se deve lembrar o login
 */
function authenticateUser(email, password, remember) {
    showMessage('Autenticando...', 'success');
    
    // Simulação de autenticação
    setTimeout(() => {
        // Aqui você faria uma chamada à sua API
        // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        
        // Simula sucesso
        localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }, 1000);
}

/**
 * Registra novo usuário (simulação)
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 */
function registerUser(name, email, password) {
    showMessage('Criando sua conta...', 'success');
    
    // Simulação de cadastro
    setTimeout(() => {
        // Aqui você faria uma chamada à sua API
        // const response = await fetch('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
        
        // Simula sucesso
        localStorage.setItem('user', JSON.stringify({ name, email, loggedIn: true }));
        
        showMessage('Conta criada com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }, 1000);
}

/**
 * Configura botões de login social
 */
function setupSocialButtons() {
    const googleBtn = document.getElementById('google-login') || document.getElementById('google-register');
    const facebookBtn = document.getElementById('facebook-login') || document.getElementById('facebook-register');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
    }
}

/**
 * Manipula login social
 * @param {string} provider - Provedor (Google, Facebook, etc)
 */
function handleSocialLogin(provider) {
    showMessage(`Conectando com ${provider}...`, 'success');
    
    // Aqui você implementaria a lógica real de OAuth
    setTimeout(() => {
        showMessage(`Login com ${provider} em desenvolvimento.`, 'error');
    }, 1000);
}

/**
 * Exibe mensagem de feedback ao usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (success ou error)
 */
function showMessage(message, type) {
    const messageElement = document.getElementById('auth-message');
    
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${type} show`;
        
        // Remove a mensagem após 5 segundos (exceto se for sucesso)
        if (type === 'error') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
}

/**
 * Verifica se usuário já está logado
 */
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.loggedIn) {
            // Usuário já está logado, redireciona para home
            // window.location.href = '../index.html';
        }
    }
}

// Verifica status de autenticação ao carregar
checkAuthStatus();