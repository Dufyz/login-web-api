// Função para buscar dados do usuário
async function fetchUserData() {
  try {
    const response = await fetch('/user_data');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    // Atualizando os elementos de entrada com os dados recebidos
    console.log(data[0]);
    document.getElementById('user_name').value = data.user_name;
    document.getElementById('email').value = data.email;
    document.getElementById('telefone').value = data.telefone;
    // document.getElementById('password').value = data.pwdHash;
    document.getElementById('estado').value = data.estado;
    document.getElementById('cidade').value = data.cidade;
    document.getElementById('cep').value = data.cep;
    document.getElementById('numero').value = data.numero;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Chame a função quando a página terminar de carregar
window.onload = fetchUserData;

document.getElementById('logout').addEventListener('click', function (event) {
  fetch('/logout', {
    method: 'POST',  // Especifica o método da requisição como POST
  })
    .then(response => {
      if (response.ok) {
        window.location.href = response.url;
      } else {
        console.error('Erro ao fazer logout:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Erro ao fazer logout:', error);
    });
});

function updateUser(user) {
  fetch('/update_user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Dados atualizados:", data);
  })
  .catch(error => {
    console.error('Erro ao atualizar:', error);
  });
};

document.getElementById('editar').addEventListener('click', function (event) {
  if (this.innerText == "Editar") {
    this.innerText = 'Salvar';
    document.getElementById('telefone').removeAttribute('readonly');
    // document.getElementById('password').removeAttribute('readonly');
    document.getElementById('estado').removeAttribute('readonly');
    document.getElementById('cidade').removeAttribute('readonly');
    document.getElementById('cep').removeAttribute('readonly');
    document.getElementById('numero').removeAttribute('readonly');
  } else {
    this.innerText = 'Editar';
    document.getElementById('telefone').setAttribute('readonly', 'readonly');
    // document.getElementById('password').setAttribute('readonly', 'readonly');
    document.getElementById('estado').setAttribute('readonly', 'readonly');
    document.getElementById('cidade').setAttribute('readonly', 'readonly');
    document.getElementById('cep').setAttribute('readonly', 'readonly');
    document.getElementById('numero').setAttribute('readonly', 'readonly');

    user = {
      telefone: document.getElementById('telefone').value,
      estado: document.getElementById('estado').value,
      cidade: document.getElementById('cidade').value,
      cep: document.getElementById('cep').value,
      numero: document.getElementById('numero').value
    }

    updateUser(user);
  }
});