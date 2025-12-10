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
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            togglePasswordVisibility(passwordInput, togglePassword);
        });
    }
    
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
 */
function togglePasswordVisibility(input, icon) {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

/**
 * Configura validação dos formulários
 */
function setupFormValidation() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        setupPasswordMatch();
    }
}

/**
 * Manipula o envio do formulário de login
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    if (!validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter no mínimo 6 caracteres.', 'error');
        return;
    }
    
    authenticateUser(email, password, remember);
}

/**
 * Manipula o envio do formulário de cadastro
 */
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    if (name.trim().length < 3) {
        showMessage('O nome deve ter no mínimo 3 caracteres.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter no mínimo 6 caracteres.', 'error');
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
    
    registerUser(name, email, password);
}

/**
 * Autentica o usuário
 */
async function authenticateUser(email, password, remember) {
    showMessage('Autenticando...', 'success');
    
    try {
        const response = await api.post('/auth/login', { email, senha: password });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    } catch (error) {
        showMessage(error.message || 'Erro ao fazer login', 'error');
    }
}

/**
 * Registra novo usuário
 */
async function registerUser(name, email, password) {
    showMessage('Criando sua conta...', 'success');
    
    try {
        const response = await api.post('/auth/register', { 
            nome: name, 
            email, 
            senha: password 
        });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        showMessage('Conta criada com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    } catch (error) {
        showMessage(error.message || 'Erro ao criar conta', 'error');
    }
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
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
 */
function handleSocialLogin(provider) {
    showMessage(`Conectando com ${provider}...`, 'success');
    setTimeout(() => {
        showMessage(`Login com ${provider} em desenvolvimento.`, 'error');
    }, 1000);
}

/**
 * Exibe mensagem de feedback ao usuário
 */
function showMessage(message, type) {
    const messageElement = document.getElementById('auth-message');
    
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message ${type} show`;
        
        if (type === 'error') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
}