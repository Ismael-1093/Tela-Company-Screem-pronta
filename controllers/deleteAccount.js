db = require("../routes/db-config")

function deleteUserById(userId, callback) {
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return callback(err);
        }

        if (results.affectedRows === 0) {
            return callback(new Error('Usuário não encontrado'));
        }

        console.log('Usuário excluído com sucesso');
        callback(null); // Indica sucesso
    });
}

function deleteCompanyByCNPJ(userId, callback) {
    db.query('DELETE FROM Empresas WHERE cd_cnpj = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return callback(err);
        }

        if (results.affectedRows === 0) {
            return callback(new Error('Usuário não encontrado'));
        }

        console.log('Usuário excluído com sucesso');
        callback(null); // Indica sucesso
    });
}


module.exports = {deleteUserById, deleteCompanyByCNPJ};


