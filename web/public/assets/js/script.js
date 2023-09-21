function toggleSections() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    
    showRegisterLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
}

// Chame a função para habilitar o comportamento de alternância das seções
toggleSections();