document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success");
    const previewImage = document.getElementById("previewImage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita o envio padrão do formulário

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const image = document.getElementById("image").files[0];

        // Validação da senha
        if (password.length < 8) {
            errorDiv.style.display = "block";
            errorDiv.innerText = "A senha deve ter pelo menos 8 caracteres.";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 3000);
            return;
        }

        if (password !== confirmPassword) {
            errorDiv.style.display = "block";
            errorDiv.innerText = "As senhas não coincidem.";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 3000);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image); 

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'error') {
                successDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                errorDiv.innerText = data.error;
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            } else {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'block';
                successDiv.innerText = data.success;

                // Alterar o botão de registro para redirecionar para a próxima tela
                const button = document.getElementById("registerButton");
                button.innerText = "Prosseguir";
                button.onclick = () => {
                    window.location.href = "./verify.html"; // Altere para o caminho correto da próxima tela
                };
            }
        } catch (error) {
            console.error('Error:', error);
            errorDiv.style.display = 'block';
            errorDiv.innerText = 'Erro ao enviar requisição. Tente novamente.';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    });

    document.getElementById("image").addEventListener("change", function() {
        const image = this.files[0];
        if (image) {
            const imageURL = URL.createObjectURL(image);
            previewImage.src = imageURL;
            previewImage.style.display = "block"; // Mostra o contêiner da imagem
        } else {
            previewImage.style.display = "none"; // Oculta o contêiner se não houver imagem
        }
    });
});
