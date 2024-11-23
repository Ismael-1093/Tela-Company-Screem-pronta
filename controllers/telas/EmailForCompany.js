const nodemailer = require('nodemailer');
const path = require('path');
const db = require("../../routes/db-config");

class SendEmailtoCompany {
    async execute(nmuser, userEmail, userData, companyEmail, categoryName, userID, companyCNPJ, categoryID) {
        try {
            // Verificar se o usuário já se interessou pela categoria
            const alreadyInterested = await this.checkUserInterest(userID, categoryID);
            if (alreadyInterested) {
                return { success: false, message: 'Usuário já se interessou por esta categoria.' };
            }

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false,
                auth: {
                    user: 'rotacargo9@gmail.com',
                    pass: 'guox gimj ffpt nnuk' // Use uma senha de aplicativo ou variáveis de ambiente
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // Caminho absoluto para a imagem
            const logoPath = path.join(__dirname, '../../public/images/logo_bufada.png');

            let mailOptions = {
                from: 'rotacargo9@gmail.com',
                to: companyEmail,
                subject: 'Notificação de Contrato',
                html: `
                    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #ffffff;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 2px solid #007bff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                        <tr>
                                            <td style="padding: 20px; text-align: center; border-bottom: 1px solid #dddddd;">
                                                <h1 style="font-size: 24px; margin: 0; color: #000;">Notificação de Contrato</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px;">
                                                <img src="cid:logo" alt="Logo" style="max-width: 100%; height: auto;" />
                                                <p style="font-size: 16px; color: #333;">O usuário ${nmuser} se interessou pelo seu serviço de ${categoryName}</p>
                                                <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${userEmail}</p>
                                                <p style="font-size: 16px; color: #333;">
                                                <strong>Endereço:</strong> ${userData.rua}, ${userData.numero}, ${userData.bairro}, ${userData.cidade} - ${userData.estado}, CEP: ${userData.cep}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px; text-align: center; background-color: #ffffff; border-top: 1px solid #dddddd; font-size: 12px; color: #333;"></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                `,
                attachments: [
                    {
                        filename: 'logo_laranja.png',
                        path: logoPath,
                        cid: 'logo'
                    }
                ]
            };

            // Enviar o e-mail
            const info = await transporter.sendMail(mailOptions);
            console.log('Email enviado: %s', info.messageId);
            await this.insertUserInterest(userID, companyCNPJ, categoryID, userData);
            return { success: true };
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    async checkUserInterest(userID, categoryID) {
        return new Promise((resolve, reject) => {
            const checkQuery = 'SELECT * FROM UsersInteressados WHERE id = ? AND categoria_id = ?';
            db.query(checkQuery, [userID, categoryID], (error, results) => {
                if (error) {
                    console.error('Erro ao verificar no banco:', error);
                    return reject(error);
                }
                resolve(results.length > 0);
            });
        });
    }

    async insertUserInterest(userID, companyCNPJ, categoryID, userData) {
        return new Promise((resolve, reject) => {
            const insertQuery = 'INSERT INTO UsersInteressados (id, cd_cnpj, categoria_id, cep, estado, cidade, bairro, rua, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertQuery, [
                userID, 
                companyCNPJ, 
                categoryID, 
                userData.cep, 
                userData.estado, 
                userData.cidade, 
                userData.bairro, 
                userData.rua, 
                userData.numero
            ], (insertError, insertResults) => {
                if (insertError) {
                    console.error('Erro ao inserir no banco:', insertError);
                    return reject(insertError);
                }
                resolve(insertResults);
            });
        });
    }
}

module.exports = SendEmailtoCompany;
