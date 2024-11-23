const db = require("../../routes/db-config");
const multer = require("multer");
const { cnpj } = require('cpf-cnpj-validator');
const upload = require("../../routes/multerConfig");

const registerEmpresa = async (req, res) => {
    upload.single('imagem')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Erro no upload:', err);
            return res.json({ status: "error", error: err.message });
        } else if (err) {
            console.error('Erro geral no upload:', err);
            return res.json({ status: "error", error: "Erro ao fazer upload do arquivo." });
        }

        const { cd_cnpj, nm_empresa, email, password, telefone, dt_fundacao, ds_site } = req.body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (!cd_cnpj || !nm_empresa || !email || !password || !telefone || !dt_fundacao || !ds_site || !req.file) {
            return res.json({ status: "error", error: "Por favor, preencha todos os campos e faça o upload de uma imagem." });
        }

        // Validar o CNPJ
        if (!cnpj.isValid(cd_cnpj)) {
            return res.json({ status: "error", error: "CNPJ inválido." });
        }

        // Verificar se o CNPJ já está cadastrado
        const checkCNPJQuery = 'SELECT * FROM Empresas WHERE cd_cnpj = ?';
        db.query(checkCNPJQuery, [cd_cnpj], (cnpjError, cnpjResults) => {
            if (cnpjError) {
                console.error('Erro ao verificar CNPJ:', cnpjError);
                return res.json({ status: "error", error: "Erro ao verificar CNPJ." });
            }

            if (cnpjResults.length > 0) {
                return res.json({ status: "error", error: "Já existe uma empresa com este CNPJ." });
            }

            // Verificar se o e-mail já está cadastrado
            const checkEmailQuery = 'SELECT * FROM Empresas WHERE email = ?';
            db.query(checkEmailQuery, [email], (emailError, emailResults) => {
                if (emailError) {
                    console.error('Erro ao verificar e-mail:', emailError);
                    return res.json({ status: "error", error: "Erro ao verificar e-mail." });
                }

                if (emailResults.length > 0) {
                    return res.json({ status: "error", error: "Já existe uma empresa com este e-mail." });
                }

                // Hash da senha
                const hashedPassword = password; // Certifique-se de usar a função correta para o hash da senha

                // Inserir dados na tabela empresas
                const empresaInsert = {
                    cd_cnpj: cd_cnpj,
                    nm_empresa: nm_empresa,
                    email: email,
                    password: hashedPassword,
                    telefone: telefone,
                    dt_fundacao: dt_fundacao,
                    ds_site: ds_site
                };

                const empresaQuery = 'INSERT INTO Empresas SET ?';
                db.query(empresaQuery, empresaInsert, (error, results) => {
                    if (error) {
                        console.error('Erro ao inserir empresa:', error);
                        return res.json({ status: "error", error: "Erro ao inserir empresa." });
                    }

                    // Armazena o CNPJ na sessão
                    req.session.cd_cnpj = cd_cnpj;

                    // Inserir imagem
                    const imagem = req.file;
                    const imagemInsert = {
                        cd_cnpj: cd_cnpj,
                        nome: imagem.filename,
                        descricao: "Logo da empresa",
                        tipo_mime: imagem.mimetype,
                        tamanho: imagem.size,
                        dados_imagem: imagem.buffer
                    };

                    const imagemQuery = 'INSERT INTO imagensE SET ?';
                    db.query(imagemQuery, imagemInsert, (imagemError, imageResult) => {
                        if (imagemError) {
                            console.error('Erro ao inserir imagem da empresa:', imagemError);
                            return res.json({ status: "error", error: "Erro ao inserir imagem da empresa." });
                        }
                        
                        // Redirect to the page for registering the location
                        return res.json({ status: "success", success: "Empresa registrada com sucesso! Agora, registre a localização." });
                    });
                });
            });
        });
    });
};

module.exports = registerEmpresa;
