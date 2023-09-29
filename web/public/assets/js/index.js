function toggleSections() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    showRegisterLink.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });

    showLoginLink.addEventListener('click', () => {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    });
}

// Chame a função para habilitar o comportamento de alternância das seções
toggleSections();

// Função para lidar com o envio do formulário
function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        login: formData.get('user'),
        email: formData.get('email'),
        password: formData.get('senha')
    };
    fetch('/create_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                alert(result.message);
            };
            if (result.success) {
                window.location.href = '/';
            }
        });
};
