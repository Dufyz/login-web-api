// Função para buscar dados do usuário
async function fetchUserData() {
  try {
    const response = await fetch('/user_data');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    // Atualizando os elementos de entrada com os dados recebidos
    document.getElementById('update_user_name').value = data.user_name;
    document.getElementById('update_email').value = data.email;
    document.getElementById('update_rua').value = data.rua;
    document.getElementById('update_telefone').value = data.telefone;
    document.getElementById('update_estado').value = data.estado;
    document.getElementById('update_cidade').value = data.cidade;
    document.getElementById('update_cep').value = data.cep;
    document.getElementById('update_numero').value = data.numero;
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
    document.getElementById('update_telefone').removeAttribute('readonly');
    document.getElementById('update_rua').removeAttribute('readonly');
    document.getElementById('update_estado').removeAttribute('readonly');
    document.getElementById('update_cidade').removeAttribute('readonly');
    document.getElementById('update_cep').removeAttribute('readonly');
    document.getElementById('update_numero').removeAttribute('readonly');

    document.getElementById('excluir').style.visibility = "visible";
    document.getElementById('logout').style.visibility = "hidden";

  } else {
    this.innerText = 'Editar';
    document.getElementById('update_telefone').setAttribute('readonly', 'readonly');
    document.getElementById('update_rua').setAttribute('readonly', 'readonly');
    document.getElementById('update_estado').setAttribute('readonly', 'readonly');
    document.getElementById('update_cidade').setAttribute('readonly', 'readonly');
    document.getElementById('update_cep').setAttribute('readonly', 'readonly');
    document.getElementById('update_numero').setAttribute('readonly', 'readonly');

    document.getElementById('excluir').style.visibility = "hidden";
    document.getElementById('logout').style.visibility = "visible";

    user = {
      update_telefone: document.getElementById('update_telefone').value,
      update_rua: document.getElementById('update_rua').value,
      update_estado: document.getElementById('update_estado').value,
      update_cidade: document.getElementById('update_cidade').value,
      update_cep: document.getElementById('update_cep').value,
      update_numero: document.getElementById('update_numero').value
    }

    updateUser(user);
  }
});

document.getElementById('excluir').addEventListener('click', function (event) {
  fetch('/delete_user', {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/';
      } else {
        console.error('Erro ao excluir usuário:', data.message);
      }
    })
    .catch(error => {
      console.error('Erro ao excluir usuário:', error);
    });
});

