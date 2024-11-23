const db = require("../../routes/db-config");

async function getQuantidadeAvaliacoes(cd_cnpj) {
    try {
        const query = `
        SELECT COUNT(*) AS quantidade_avaliacoes FROM Avaliacoes WHERE cd_cnpj = ?;
        `;
        const [results] = await db.promise().query(query, [cd_cnpj]); // Passando cd_cnpj como parâmetro
        return results[0].quantidade_avaliacoes; // Retorna o número de avaliações
    } catch (err) {
        console.error('Erro na consulta SQL:', err);
        throw err;
    }
}

module.exports = {
    getQuantidadeAvaliacoes
};
