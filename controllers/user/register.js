/*const db = require("../routes/db-config");
const multer = require("multer");
const upload = require("../routes/multerConfig");

const register = async (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Erro no upload:', err);
            return res.json({ status: "error", error: err.message });
        } else if (err) {
            console.error('Erro geral no upload:', err);
            return res.json({ status: "error", error: "Erro ao fazer upload do arquivo." });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password || !req.file) {
            return res.json({ status: "error", error: "Por favor, preencha todos os campos e faça o upload de uma imagem." });
        }

        const image = req.file; 

        try {
            // Verificar se o email já está registrado
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                    console.error('Erro ao verificar email:', error);
                    return res.json({ status: "error", error: "Erro ao verificar email." });
                }

                if (results.length > 0) {
                    return res.json({ status: "error", error: "Email já registrado." });
                }

                // Inserir dados na tabela users
                db.query('INSERT INTO users SET ?', { nm_users: name, email: email, password: password }, async (error, results) => {
                    if (error) {
                        console.error('Erro ao inserir usuário:', error);
                        throw error;
                    }

                    // Inserir dados na tabela imagens
                    db.query('INSERT INTO imagens SET ?', {
                        id: results.insertId, 
                        nome: image.filename,
                        descricao: "Imagem de perfil do usuário",
                        tipo_mime: image.mimetype,
                        tamanho: image.size,
                        dados_imagem: image.buffer 
                    }, (err, imageResult) => {
                        if (err) {
                            console.error('Erro ao inserir imagem:', err);
                            throw err;
                        }
                        console.log('Usuário registrado com sucesso!');
                        return res.json({ status: "success", success: "Usuário registrado com sucesso!" });
                    });
                });
            });

        } catch (error) {
            console.error('Erro no registro:', error);
            return res.json({ status: "error", error: "Erro ao registrar usuário." });
        }
    });
};

module.exports = register;
*/


const db = require("../../routes/db-config");
const multer = require("multer");
const upload = require("../../routes/multerConfig");
const SendEmailService = require('./SendEmailService');

const register = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload.single('image')(req, res, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const { name, email, password } = req.body;
        const image = req.file;

        if (!name || !email || !password || !image) {
            return res.json({ status: "error", error: "Por favor, preencha todos os campos e faça o upload de uma imagem." });
        }

        // Verificar e inserir dados
        const userExists = await new Promise((resolve, reject) => {
            db.query('SELECT 1 FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results.length > 0);
            });
        });

        if (userExists) {
            return res.json({ status: "error", error: "Email já registrado." });
        }

        const insertUserResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET ?', { nm_users: name, email: email, password: password }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        await new Promise((resolve, reject) => {
            db.query('INSERT INTO imagens SET ?', {
                id: insertUserResult.insertId,
                nome: image.filename,
                descricao: "Imagem de perfil do usuário",
                tipo_mime: image.mimetype,
                tamanho: image.size,
                dados_imagem: image.buffer
            }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Enviar e-mail de verificação
        const emailService = new SendEmailService();
        await new Promise((resolve, reject) => {
            emailService.execute(name, email, (emailError, info) => {
                if (emailError) return reject(emailError);
                resolve(info);
            });
        });

        console.log('Usuário registrado com sucesso!');
        res.json({ status: "success", success: "Usuário registrado com sucesso! Verifique seu e-mail para confirmar sua conta." });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.json({ status: "error", error: "Erro ao registrar usuário." });
    }
};

module.exports = register;
