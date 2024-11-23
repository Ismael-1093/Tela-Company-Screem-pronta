document.getElementById('empresaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário e os organiza em um objeto
    const data = {
        cep: document.getElementById('cep').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        numero: document.getElementById('numero').value.trim(),
        bairro: document.getElementById('bairro').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim()
    };

    // Adicione um log para verificar os dados
    console.log('Dados enviados:', data);

    fetch('/api/registerLocal', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Resposta do servidor:', data); // Adicione log da resposta
        const successMessage = document.getElementById('success');
        const errorMessage = document.getElementById('error');

        if (data.status === 'error') {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.innerText = data.error;
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000); 
        } else {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.innerText = data.success;

            // Alterar o botão de registro para redirecionar para o login
            const button = document.getElementById("registerButton");
            button.innerText = "Escolher categorias";
            button.onclick = () => {
                window.location.href = "/categorias.html"; 
            };
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error');
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Erro ao enviar requisição. Tente novamente.';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000); 
    });
});


document.getElementById("cep").addEventListener("input", async function() {
    const cep = this.value.trim();
    if (cep.length === 8 && !isNaN(cep)) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                document.getElementById("endereco").value = data.logradouro || "";
                document.getElementById("bairro").value = data.bairro || "";
                document.getElementById("cidade").value = data.localidade || "";
                document.getElementById("estado").value = data.uf || "";
            }

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }
});
