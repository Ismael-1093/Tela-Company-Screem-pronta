document.getElementById('empresaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Função de validação da senha
    function validatePassword(password) {
        return password.length >= 8; // Senha deve ter pelo menos 8 caracteres
    }

    function validateForm() {
        const password = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const errorMessage = document.getElementById('error');

        // Validação da senha
        if (!validatePassword(password)) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'A senha deve ter pelo menos 8 caracteres.';
            setTimeout(() => errorMessage.style.display = 'none', 3000);
            return false;
        }

        // Verificação de correspondência de senha
        if (password !== confirmarSenha) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'As senhas não correspondem. Verifique e tente novamente.';
            setTimeout(() => errorMessage.style.display = 'none', 3000);
            return false;
        }

        return true;
    }

    // Validação do formulário antes de enviar
    if (!validateForm()) {
        return; // Se a validação falhar, não envie o formulário
    }

    const formData = new FormData();
    formData.append('cd_cnpj', document.getElementById('cnpj').value.trim());
    formData.append('nm_empresa', document.getElementById('nome').value.trim());
    formData.append('email', document.getElementById('email').value.trim());
    formData.append('password', document.getElementById('senha').value.trim());
    formData.append('telefone', document.getElementById('telefone').value.trim());
    formData.append('dt_fundacao', document.getElementById('fundacao').value);
    formData.append('ds_site', document.getElementById('site').value.trim());
    formData.append('imagem', document.getElementById('imagem').files[0]);

    fetch('/api/registerEmpresa', { 
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        const successMessage = document.getElementById('success');
        const errorMessage = document.getElementById('error');

        if (data.status === 'error') {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.innerText = data.error;
            setTimeout(() => errorMessage.style.display = 'none', 3000);
        } else {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.innerText = data.success;

            // Alterar o botão de registro para redirecionar para o login
            const button = document.getElementById("registerButton");
            button.innerText = "Prosseguir";
            button.onclick = () => {
                window.location.href = "/registerLocal.html"; // Altere para o caminho correto da tela de login
            };
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error');
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Erro ao enviar requisição. Tente novamente.';
        setTimeout(() => errorMessage.style.display = 'none', 3000);
    });
});

// Visualização da imagem
document.getElementById("imagem").addEventListener("change", function() {
    const image = this.files[0];
    const previewImage = document.getElementById('previewImage');
    if (image) {
        const imageURL = URL.createObjectURL(image);
        previewImage.src = imageURL;
        previewImage.style.display = "block"; // Mostra o contêiner da imagem
    }
});

// Formatação do telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');

    telefoneInput.addEventListener('input', function(event) {
        let input = event.target;
        let value = input.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        let formattedValue = '';

        if (value.length > 6) {
            formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            formattedValue = value.replace(/^(\d{2})(\d{0,4})$/, '($1) $2');
        } else {
            formattedValue = value.replace(/^(\d*)$/, '($1');
        }

        // Remove parênteses e espaços quando o campo estiver vazio
        if (value.length === 0) {
            formattedValue = '';
        }

        input.value = formattedValue;
    });
});
