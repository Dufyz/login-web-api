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