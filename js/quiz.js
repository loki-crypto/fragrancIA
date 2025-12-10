/* ==========================================================================
   LÓGICA DO QUIZ DE PERFUMES
   ========================================================================== */

// DADOS DO QUIZ
const quizData = [
    {
        question: "Qual período do dia será o evento?",
        options: ["Manhã", "Tarde", "Crepúsculo", "Noite"],
        name: "periodo"
    },
    {
        question: "Qual será o tipo de evento?",
        options: ["Casual", "Encontro Romântico", "Reunião de Trabalho", "Ocasião Especial"],
        name: "evento"
    },
    {
        question: "Qual família de aromas mais te atrai?",
        options: ["Amadeirado", "Fresco/Cítrico", "Floral", "Adocicado/Oriental"],
        name: "familia"
    },
    {
        question: "Qual a intensidade que você busca?",
        options: ["Discreto e Sutil", "Equilibrado", "Marcante e Duradouro"],
        name: "intensidade"
    },
    {
        question: "Que impressão você quer causar?",
        options: ["Elegante e Sofisticado(a)", "Moderno(a) e Criativo(a)", "Sedutor(a) e Misterioso(a)", "Alegre e Energizante"],
        name: "impressao"
    }
];

// ELEMENTOS DO DOM
const questionTitleElement = document.getElementById('question-title');
const optionsListElement = document.getElementById('options-list');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const mainTitleElement = document.getElementById('main-title');
const questionBlock = document.getElementById('question-block');
const quizComplete = document.getElementById('quiz-complete');
const progressBar = document.getElementById('progress-bar');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const progressPercentage = document.getElementById('progress-percentage');

// VARIÁVEIS DE CONTROLE
let currentQuestionIndex = 0;
let userAnswers = {};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

/**
 * Inicializa o quiz
 */
function initializeQuiz() {
    totalQuestionsSpan.textContent = quizData.length;
    loadQuestion();
    setupEventListeners();
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
    nextButton.addEventListener('click', handleNextQuestion);
    prevButton.addEventListener('click', handlePreviousQuestion);
}

/**
 * Carrega a pergunta atual
 */
function loadQuestion() {
    // Limpa as opções anteriores
    optionsListElement.innerHTML = '';
    
    const currentQuestion = quizData[currentQuestionIndex];
    
    // Atualiza o título da pergunta
    questionTitleElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    
    // Cria as opções
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');
        
        const uniqueId = `${currentQuestion.name}-${index}`;
        const optionValue = option.toLowerCase().replace(/[\s\/()]+/g, '_');
        
        input.type = 'radio';
        input.name = currentQuestion.name;
        input.value = optionValue;
        input.id = uniqueId;
        
        // Se já havia uma resposta selecionada, marca ela
        if (userAnswers[currentQuestion.name] === optionValue) {
            input.checked = true;
        }
        
        // Adiciona evento de mudança
        input.addEventListener('change', handleOptionSelect);
        
        label.htmlFor = uniqueId;
        label.textContent = option;
        
        li.appendChild(input);
        li.appendChild(label);
        optionsListElement.appendChild(li);
    });
    
    // Atualiza a UI
    updateProgress();
    updateNavigationButtons();
}

/**
 * Manipula a seleção de uma opção
 */
function handleOptionSelect() {
    // Habilita o botão de próximo quando uma opção é selecionada
    nextButton.disabled = false;
}

/**
 * Atualiza a barra de progresso
 */
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    progressPercentage.textContent = `${Math.round(progress)}%`;
}

/**
 * Atualiza os botões de navegação
 */
function updateNavigationButtons() {
    // Botão anterior
    prevButton.disabled = currentQuestionIndex === 0;
    
    // Botão próximo
    const selectedOption = document.querySelector(`input[name="${quizData[currentQuestionIndex].name}"]:checked`);
    nextButton.disabled = !selectedOption;
}

/**
 * Manipula o clique no botão "Próximo"
 */
function handleNextQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    const selectedOption = document.querySelector(`input[name="${currentQuestion.name}"]:checked`);
    
    if (!selectedOption) {
        showNotification('Por favor, selecione uma opção para continuar.', 'warning');
        return;
    }
    
    // Salva a resposta
    userAnswers[currentQuestion.name] = selectedOption.value;
    
    // Avança para a próxima pergunta ou finaliza
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        scrollToTop();
    } else {
        finishQuiz();
    }
}

/**
 * Manipula o clique no botão "Anterior"
 */
function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
        scrollToTop();
    }
}

/**
 * Finaliza o quiz
 */
async function finishQuiz() {
    const token = localStorage.getItem('token');
    
    // Salva localmente também (fallback)
    localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('quizDate', new Date().toISOString());
    
    // Mostra tela de conclusão
    mainTitleElement.style.display = 'none';
    questionBlock.style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.querySelector('.navigation-buttons').style.display = 'none';
    quizComplete.style.display = 'block';
    
    // Se estiver logado, salva na API
    if (token) {
        try {
            await api.post('/quiz', userAnswers);
            console.log('Quiz salvo na API com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar quiz na API:', error);
            // Continua mesmo com erro - já salvou no localStorage
        }
    }
    
    // Redireciona após 2 segundos
    setTimeout(() => {
        window.location.href = 'resultados.html';
    }, 2000);
}

/**
 * Rola para o topo da página
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Mostra uma notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação (success, warning, error)
 */
function showNotification(message, type = 'info') {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'warning' ? '#ff9800' : '#4caf50'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adiciona estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);