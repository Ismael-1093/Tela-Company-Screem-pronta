const jwt = require("jsonwebtoken");
const db = require("../../routes/db-config");

const loginE = async (req, res) => {
    const { cnpj, password } = req.body;

    // Verifique se o CNPJ e a senha foram fornecidos
    if (!cnpj || !password) {
        return res.status(400).json({ status: "error", error: "Por favor, insira seu CNPJ e senha" });
    }

    try {
        // Consulte o banco de dados para encontrar a empresa com o CNPJ fornecido
        db.query('SELECT * FROM Empresas WHERE cd_cnpj = ?', [cnpj], async (err, result) => {
            if (err) {
                console.error("Erro ao consultar banco de dados:", err);
                return res.status(500).json({ status: "error", error: "Erro ao consultar banco de dados" });
            }

            // Verifique se o CNPJ foi encontrado
            if (result.length === 0) {
                return res.status(404).json({ status: "error", error: "CNPJ não encontrado" });
            }

            // Recupere a empresa da consulta
            const empresa = result[0];

            // Verifique a senha fornecida com a senha armazenada (comparação simples, não segura)
            if (password !== empresa.password) {
                return res.status(401).json({ status: "error", error: "Senha incorreta" });
            }

            // Gere o token JWT
            const token = jwt.sign({ cnpj: empresa.cd_cnpj }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES
            });

            // Configure as opções do cookie
            const cookieOptions = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            // Envie o cookie com o token
            res.cookie("CompanyRegistered", token, cookieOptions);
            return res.json({ status: "success", success: "Empresa logada com sucesso" });
        });
    } catch (err) {
        console.error("Erro durante o login:", err);
        return res.status(500).json({ status: "error", error: "Erro durante o login" });
    }
}

module.exports = loginE;
