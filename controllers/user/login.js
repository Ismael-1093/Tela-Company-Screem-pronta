const jwt = require("jsonwebtoken");
const db = require("../../routes/db-config");

const login = async (req, res) => {
    const { email, password } = req.body;

    // Verifique se o email e a senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ status: "error", error: "Por favor, insira seu email e senha" });
    }

    // Consulte o banco de dados para encontrar o usuário com o email fornecido
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ status: "error", error: "Erro no servidor" });
        }

        // Verifique se o usuário foi encontrado
        if (result.length === 0) {
            return res.status(401).json({ status: "error", error: "Usuário não encontrado" });
        }

        // Recupere o usuário da consulta
        const user = result[0];

        // Verifique a senha fornecida com a senha armazenada (comparação simples, não segura)
        if (password !== user.password) {
            return res.status(401).json({ status: "error", error: "Senha incorreta" });
        }

        // Gere o token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        // Configure as opções do cookie
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Envie o cookie com o token
        res.cookie("userRegistered", token, cookieOptions);
        return res.json({ status: "success", success: "Usuário logado com sucesso" });
    });
};

module.exports = login;
