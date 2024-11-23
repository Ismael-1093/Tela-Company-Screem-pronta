const jwt = require("jsonwebtoken");
const db = require("../../routes/db-config");

const loggedinE = (req, res, next) => {
    // Verifica se o cookie 'CompanyRegistered' está presente
    if (!req.cookies.CompanyRegistered) {
        return next(); // Se não estiver presente, continua o fluxo normalmente
    }

    try {
        const token = req.cookies.CompanyRegistered;
        // Decodifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { cnpj } = decoded;

        // Verifica se o CNPJ está presente no banco de dados
        db.query('SELECT * FROM Empresas WHERE cd_cnpj = ?', [cnpj], (err, result) => {
            if (err) {
                console.error("Erro ao consultar banco de dados:", err);
                // Passa o erro para o próximo middleware de tratamento de erros
                return next(err);
            }

            if (!result.length) {
                console.error("Empresa não encontrada com o CNPJ:", cnpj);

                // Se a empresa não for encontrada, continua o fluxo normalmente
                return next();
            }

            // Se a empresa for encontrada, adiciona os dados da empresa ao objeto 'req'
            req.company = result[0];
            // Continua o fluxo para o próximo middleware ou rota
            return next();
        });
    } catch (err) {
        // Captura e loga erros relacionados ao JWT
        console.error("Erro ao decodificar JWT:", err);
        // Passa o erro para o próximo middleware de tratamento de erros
        return next(err);
    }
};



module.exports = loggedinE;
