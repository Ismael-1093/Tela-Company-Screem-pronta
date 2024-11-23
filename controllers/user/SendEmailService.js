const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const db = require('../../routes/db-config');

class SendEmailService {
    async execute(name, email, callback) {
        const randomCode = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'rotacargo9@gmail.com',
                pass: 'guox gimj ffpt nnuk'  // Você deve usar uma senha de aplicativo ou variáveis de ambiente para maior segurança
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Caminho absoluto para a imagem
        const logoPath = path.join(__dirname, '../../public/images/logo_bufada.png');

        let mailOptions = {
            from: 'rotacargo9@gmail.com',
            to: email,
            subject: 'Seu código de verificação',
            text: `Olá ${name},\n\nSeu código de verificação é: ${randomCode}`,
            html: `
                <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 2px solid #007bff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="padding: 20px; text-align: center; border-bottom: 1px solid #dddddd;">
                                            <h1 style="font-size: 24px; margin: 0; color: #000;">Código de Verificação</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px;">
                                            <img src="cid:logo" alt="Logo" style="max-width: 100%; height: auto;" />
                                            <p style="font-size: 16px; color: #333;">Olá ${name},</p>
                                            <p style="font-size: 16px; color: #333;">Seu código de verificação é:</p>
                                            <div style="font-size: 36px; font-weight: bold; color: #000; background-color: #ffffff; border: 1px solid #dddddd; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0;">
                                                ${randomCode}
                                            </div>
                                            <p style="font-size: 16px; color: #333;">Use este código para verificar sua conta.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; text-align: center; background-color: #ffffff; border-top: 1px solid #dddddd; font-size: 12px; color: #333;">
                                        </td>
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
                    cid: 'logo' // Este CID será usado para referenciar a imagem no HTML
                }
            ]
        };

        try {
            // Verificar e atualizar/inserir o e-mail no banco de dados
            await new Promise((resolve, reject) => {
                db.query('INSERT INTO EmailVerification (email, verification_code, created_at, expires_at) VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)) ON DUPLICATE KEY UPDATE verification_code = ?, created_at = CURRENT_TIMESTAMP, expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)', [email, randomCode, randomCode], (error) => {
                    if (error) {
                        console.error('Erro ao atualizar/inserir código de verificação:', error);
                        return reject(error);
                    }
                    resolve();
                });
            });

            // Enviar o e-mail
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (mailError, info) => {
                    if (mailError) {
                        console.error('Erro ao enviar e-mail:', mailError);
                        return reject(mailError);
                    }
                    console.log('Email enviado: %s', info.messageId);
                    resolve(info);
                });
            });

            callback(null, { success: true });
        } catch (error) {
            callback(error);
        }
    }
}

module.exports = SendEmailService;
