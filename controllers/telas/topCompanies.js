const db = require("../../routes/db-config");

async function getCompaniesFromDatabase() {
    try {
        const query = `
           SELECT 
    E.cd_cnpj,
    E.nm_empresa,
    AVG(A.avaliacao) AS media_avaliacao,
    I.nome AS imagem_nome
FROM 
    Avaliacoes A
JOIN 
    Empresas E ON A.cd_cnpj = E.cd_cnpj
LEFT JOIN 
    imagensE I ON E.cd_cnpj = I.cd_cnpj
GROUP BY 
    E.cd_cnpj, E.nm_empresa, I.nome
ORDER BY 
    media_avaliacao DESC
LIMIT 10;
        `;
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        console.error('Erro na consulta SQL:', err);
        throw err;
    }
}

module.exports = {
    getCompaniesFromDatabase
};
