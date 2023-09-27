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
      document.getElementById('user_name').value = data[0].user_name;
      document.getElementById('email').value = data[0].email;
    //   document.getElementById('telefone').value = data[0].telefone;
    //   document.getElementById('password').value = data[0].password;
} catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }
  
  // Chame a função quando a página terminar de carregar
  window.onload = fetchUserData;