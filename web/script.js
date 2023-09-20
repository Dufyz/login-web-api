// Ouvinte de evento para o link "Registrar"
document.getElementById('show-register-link').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'none'; // Oculta o formulário de login
    document.getElementById('register-form').style.display = 'flex'; // Exibe o formulário de registro
});

// Ouvinte de evento para o link "Login" no formulário de registro
document.getElementById('show-login-link').addEventListener('click', function() {
    document.getElementById('register-form').style.display = 'none'; // Oculta o formulário de registro
    document.getElementById('login-form').style.display = 'flex'; // Exibe o formulário de login
});
