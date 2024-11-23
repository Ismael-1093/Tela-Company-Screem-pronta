const db = require("../../routes/db-config");

async function Filter(estado, categoria) { // Recebe os parâmetros
    try {
        const query = `
  SELECT 
    e.cd_cnpj, 
    e.nm_empresa, 
    l.estado, 
    c.nm_categoria, 
    AVG(a.avaliacao) AS media_avaliacao,
    ie.nome AS imagem_nome 
FROM 
    Empresas e
JOIN 
    LocalEmpresa l ON e.cd_cnpj = l.cd_cnpj
LEFT JOIN 
    CategoriaEmpresa c ON e.cd_cnpj = c.cd_cnpj
LEFT JOIN 
    Avaliacoes a ON e.cd_cnpj = a.cd_cnpj
LEFT JOIN 
    imagensE ie ON e.cd_cnpj = ie.cd_cnpj
WHERE 
    (l.estado = ? OR ? = '') AND 
    (c.nm_categoria = ? OR ? = '')
GROUP BY 
    e.cd_cnpj, l.estado, c.nm_categoria, ie.nome;

`;

        
        const [results] = await db.promise().query(query, [estado, estado, categoria, categoria]); // Passa os parâmetros para a query
        return results;
    } catch (err) {
        console.error('Erro na consulta SQL:', err);
        throw err;
    }
}


module.exports = {
    Filter
};
