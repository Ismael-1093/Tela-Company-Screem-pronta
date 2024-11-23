const db = require('../../routes/db-config'); // Ajuste o caminho conforme sua estrutura

// Função para obter o catálogo de empresas
async function getCompaniesCatalog() {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT 
                E.cd_cnpj,
                E.nm_empresa,
                COALESCE(AVG(A.avaliacao), 0) AS media_avaliacao,
                I.nome AS imagem_nome
            FROM 
                Empresas E
            LEFT JOIN 
                Avaliacoes A ON E.cd_cnpj = A.cd_cnpj
            LEFT JOIN 
                imagensE I ON E.cd_cnpj = I.cd_cnpj
            GROUP BY 
                E.cd_cnpj, E.nm_empresa, I.nome;
        `, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

module.exports = { getCompaniesCatalog };
