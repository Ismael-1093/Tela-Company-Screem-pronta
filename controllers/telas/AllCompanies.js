const db = require("../../routes/db-config");

async function getTop10AlphabeticalCompanies() {
    try {
        const query = `
            SELECT 
                E.cd_cnpj,
                E.nm_empresa,
                AVG(A.avaliacao) AS media_avaliacao,
                I.nome AS imagem_nome
            FROM 
                Empresas E
            LEFT JOIN 
                Avaliacoes A ON E.cd_cnpj = A.cd_cnpj
            LEFT JOIN 
                imagensE I ON E.cd_cnpj = I.cd_cnpj
            GROUP BY 
                E.cd_cnpj, E.nm_empresa, I.nome
            ORDER BY 
                E.nm_empresa ASC
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
    getTop10AlphabeticalCompanies
};
