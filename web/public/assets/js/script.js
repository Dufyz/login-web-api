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

// Função para carregar os usuários
function loadUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            const table = document.getElementById('usersTable');
            users.forEach(user => {
                const row = table.insertRow();
                row.insertCell(0).textContent = user.pkUser;
                row.insertCell(1).textContent = user.login;
                row.insertCell(2).textContent = user.email;
                row.insertCell(3).textContent = user.created_at;
            });
        });
}

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
                // Recarregar os usuários após o registro
                loadUsers();
            }
        });
}

// Carregar os usuários quando a página for carregada
window.onload = loadUsers;