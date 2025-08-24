// Variables pour gérer l'état des sidebars
let leftSidebarOpen = window.innerWidth >= 992;
let rightSidebarOpen = window.innerWidth >= 992;

// Éléments DOM
const sidebarLeft = document.getElementById('sidebarLeft');
const sidebarRight = document.getElementById('sidebarRight');
const mainContent = document.getElementById('mainContent');
const toggleLeft = document.getElementById('toggleLeft');
const toggleRight = document.getElementById('toggleRight');
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');
const chatMessages = document.getElementById('chatMessages');

// Fonction pour mettre à jour l'affichage
function updateLayout() {
    // Sidebar gauche
    if (leftSidebarOpen) {
        sidebarLeft.classList.remove('collapsed');
        if (window.innerWidth >= 992) {
            mainContent.classList.remove('left-collapsed');
        }
        toggleLeft.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        sidebarLeft.classList.add('collapsed');
        mainContent.classList.add('left-collapsed');
        toggleLeft.innerHTML = '<i class="fas fa-bars"></i>';
    }

    // Sidebar droite
    if (rightSidebarOpen) {
        sidebarRight.classList.remove('collapsed');
        if (window.innerWidth >= 992) {
            mainContent.classList.remove('right-collapsed');
        }
        toggleRight.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        sidebarRight.classList.add('collapsed');
        mainContent.classList.add('right-collapsed');
        toggleRight.innerHTML = '<i class="fas fa-history"></i>';
    }
}

// Toggle sidebar gauche
toggleLeft.addEventListener('click', () => {
    leftSidebarOpen = !leftSidebarOpen;
    updateLayout();
});

// Toggle sidebar droite
toggleRight.addEventListener('click', () => {
    rightSidebarOpen = !rightSidebarOpen;
    updateLayout();
});

// Fermer les sidebars en cliquant sur le contenu principal sur mobile
mainContent.addEventListener('click', () => {
    if (window.innerWidth < 992) {
        leftSidebarOpen = false;
        rightSidebarOpen = false;
        updateLayout();
    }
});

// Gestion responsive
window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
        leftSidebarOpen = true;
        rightSidebarOpen = true;
    } else {
        leftSidebarOpen = false;
        rightSidebarOpen = false;
    }
    updateLayout();
});

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Envoyer message avec Entrée
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Bouton envoyer
sendBtn.addEventListener('click', sendMessage);

// Fonction pour envoyer un message
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Simuler une réponse de l'IA après 1 seconde
        setTimeout(() => {
            addMessage('Je traite votre demande...', 'ai');
        }, 1000);
    }
}

// Fonction pour ajouter un message
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const isUser = sender === 'user';
    const avatarClass = isUser ? 'user-avatar-msg' : 'ai-avatar-msg';
    const avatarContent = isUser ? 'Y' : '<i class="fas fa-brain"></i>';
    const contentClass = isUser ? '' : 'ai-response';
    const badge = isUser ? '' : '<span class="badge bg-primary ms-2">AI</span>';
    
    messageDiv.innerHTML = `
        <div class="message-user">
            <div class="message-avatar ${avatarClass}">${avatarContent}</div>
            <div class="message-content ${contentClass}">
                ${!isUser ? `<div class="fw-bold mb-2"><i class="fas fa-robot me-2"></i>AiWave${badge}</div>` : ''}
                ${text}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gestion des éléments d'application
document.querySelectorAll('.app-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.app-item').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialisation
updateLayout();
