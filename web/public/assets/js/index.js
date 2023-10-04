function toggleSections() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const passwordForm = document.getElementById('password-form');

    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const showLoginLink2 = document.getElementById('show-login-link-2');
    const showPasswordLink = document.getElementById('show-password-link');

    showRegisterLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        passwordForm.style.display = 'none';
    });

    showLoginLink.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordForm.style.display = 'none';
    });

    showPasswordLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        passwordForm.style.display = 'block';
    });

    showLoginLink2.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        passwordForm.style.display = 'none';
    });
}

toggleSections();