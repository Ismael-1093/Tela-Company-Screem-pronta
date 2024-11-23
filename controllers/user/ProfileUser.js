const db = require("../../routes/db-config");

async function getUserProfile(userId) {
    try {
        const query = `
            SELECT users.*, imagens.nome AS nome_imagem
            FROM users
            LEFT JOIN imagens ON users.id = imagens.id
            WHERE users.id = ?
        `;

        const [result] = await db.promise().query(query, [userId]);

        if (result.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        return result[0];
    } catch (err) {
        console.error('Erro ao obter informações do perfil:', err);
        throw err;
    }
}

async function updateUserProfile(id, nome, senha, imagem) {
    try {
        let updateQueries = [];
        let updateParams = [];

        // Verificar se há uma imagem existente para atualizar
        if (imagem) {
            const checkImageQuery = 'SELECT id FROM imagens WHERE id = ?';
            const [imageResult] = await db.promise().query(checkImageQuery, [id]);

            if (imageResult.length > 0) {
                // Atualizar imagem existente
                const updateImageQuery = `
                    UPDATE imagens
                    SET nome = ?, tipo_mime = ?, tamanho = ?, dados_imagem = ?
                    WHERE id = ?
                `;
                const updateImageParams = [
                    imagem.filename,
                    imagem.mimetype,
                    imagem.size,
                    imagem.buffer,
                    id
                ];
                updateQueries.push(updateImageQuery);
                updateParams.push(updateImageParams);
            } else {
                // Inserir nova imagem se não existir
                const insertImageQuery = 'INSERT INTO imagens SET ?';
                const insertImageParams = {
                    id: id,
                    nome: imagem.filename,
                    descricao: "Imagem de perfil do usuário",
                    tipo_mime: imagem.mimetype,
                    tamanho: imagem.size,
                    dados_imagem: imagem.buffer
                };
                updateQueries.push(insertImageQuery);
                updateParams.push(insertImageParams);
            }
        }

        // Atualizar nome e senha se fornecidos
        if (nome && senha) {
            const updateUserQuery = 'UPDATE users SET nm_users = ?, password = ? WHERE id = ?';
            const updateUserParams = [nome, senha, id];
            updateQueries.push(updateUserQuery);
            updateParams.push(updateUserParams);
        } else if (nome) {
            const updateUserQuery = 'UPDATE users SET nm_users = ? WHERE id = ?';
            const updateUserParams = [nome, id];
            updateQueries.push(updateUserQuery);
            updateParams.push(updateUserParams);
        }

        // Executar todas as consultas em uma transação
        await db.promise().beginTransaction();

        for (let i = 0; i < updateQueries.length; i++) {
            await db.promise().query(updateQueries[i], updateParams[i]);
        }

        await db.promise().commit();
        
        console.log('Informações do perfil atualizadas com sucesso');
    } catch (err) {
        await db.promise().rollback();
        console.error('Erro ao atualizar informações do perfil:', err);
        throw err;
    }
}


module.exports = {
    getUserProfile,
    updateUserProfile
};
