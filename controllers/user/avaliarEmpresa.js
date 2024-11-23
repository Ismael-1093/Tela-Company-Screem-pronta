const db = require("../../routes/db-config");

async function avaliarEmpresa(req, res) {
    const { cnpj, avaliacao, comentario } = req.body;
    const userId = req.user.id; 

    const sqlInsert = 'INSERT INTO Avaliacoes (cd_cnpj, avaliacao, ds_comentario, id) VALUES (?, ?, ?, ?)';

    try {
        await db.promise().query(sqlInsert, [cnpj, avaliacao, comentario, userId]);
        res.redirect(`/company/${cnpj}`); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar a avaliação');
    }
}

module.exports = {
    avaliarEmpresa
};
