const express = require("express");
const register = require("../controllers/user/register")
const loggedIn = require("../controllers/user/loggedin");
const logout = require("../controllers/logout");
const loggedinE = require("../controllers/empresa/loggedinE");
const registerEmpresa = require("../controllers/empresa/registerE");
const db = require("./db-config");
const router = express.Router();
const upload = require("./multerConfig")
const registerLocalizacao = require("../controllers/empresa/registerLocal")
const { avaliarEmpresa } = require('../controllers/user/avaliarEmpresa');
const { getCompanyDetails } = require('../controllers/telas/CompanyScreen');
const { getCompaniesFromDatabase } = require("../controllers/telas/topCompanies");
const { getUserProfile, updateUserProfile } = require("../controllers/user/ProfileUser");
const { getCompanyProfile, updateCompanyProfile } = require("../controllers/empresa/ProfileCompany");
const {deleteUserById, deleteCompanyByCNPJ} = require("../controllers/deleteAccount")
const {getTop10AlphabeticalCompanies} = require("../controllers/telas/AllCompanies")
const { getCompaniesCatalog  } = require('../controllers/telas/CompaniesCatlog');
const {getQuantidadeAvaliacoes} = require('../controllers/telas/dashInfo')
const SendEmailtoCompany = require("../controllers/telas/EmailForCompany")
const {Filter} = require("../controllers/telas/Filtros")

router.post('/enviar-categorias', async (req, res) => {
    const { nmuser, userEmail, categoryName, address, userID, CompanyCnpj, categoryID } = req.body;
    const companyEmail = req.body.companyEmail;

    const sendEmailService = new SendEmailtoCompany();

    try {
        const result = await sendEmailService.execute(nmuser, userEmail, address, companyEmail, categoryName, userID, CompanyCnpj, categoryID);
        
        if (!result.success) {
            return res.status(200).json({ success: false, message: result.message });
        }

        return res.json({ success: true, message: 'E-mail enviado com sucesso e interesse registrado.' });
    } catch (err) {
        console.error('Erro ao enviar e-mail:', err);
        return res.status(500).json({ success: false, message: 'Usuário já se interessou por essa categoria' });
    }
});




router.get('/', loggedIn, loggedinE, async (req, res) => {
    try {
 
        

        let companies = await getCompaniesFromDatabase();
        let allcompanies = await getTop10AlphabeticalCompanies();
        let status = '';
        let user = null;
        let company = {}; // Inicializa como um objeto vazio
        let quantidadeAvaliacoes = 0; // Inicializa a variável

        if (req.user) {
            status = 'loggedIn';
            user = await getUserProfile(req.user.id);
        } 

        // Verifica se a empresa está logada
        if (req.company) {
            status = 'loggedinE';
            company = await getCompanyProfile(req.company.cd_cnpj);

            // Chama a função para obter a quantidade de avaliações
            quantidadeAvaliacoes = await getQuantidadeAvaliacoes(req.company.cd_cnpj);
        } 



        // Defina o caminho da imagem padrão
        const userImagePath = (user && user.nome_imagem) ? `/uploads/${user.nome_imagem}` : '/images/noimage.jpg';
        const companyImagePath = (company && company.nome_imagem) ? `/uploads/${company.nome_imagem}` : '/images/noimage.jpg';

        res.render('index.ejs', { 
            allcompanies,
            companies, 
            status, 
            user, 
            company,  
            quantidadeAvaliacoes, // Passa a quantidade de avaliações para a view
            imagePath: userImagePath,
            companyImagePath: companyImagePath 
        });
    } catch (err) {
        console.error('Erro ao obter informações:', err);
        res.status(500).send('Erro ao obter informações');
    }
});




router.get("/registerLocal", (req, res) => {
    res.sendFile("registerLocal.html", { root: "./public/" });
});

router.get('/company/:cd_cnpj', loggedIn, loggedinE, async (req, res) => {
    await getCompanyDetails(req, res);
});


router.post('/avaliar', loggedIn, loggedinE, async (req, res) => {
    try {
        await avaliarEmpresa(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao processar a avaliação.'); // Opcional, dependendo do que você quer fazer
    }
});




router.get("/Profile", loggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserProfile(userId); 
        const evaluatedCompanies = await getEvaluatedCompanies(userId); // Obtém as empresas avaliadas

        res.render("Profile.ejs", { 
            user, 
            evaluatedCompanies, // Passa as empresas avaliadas para a view
            imagePath: `/uploads/${user.nome_imagem}` 
        });
    } catch (err) {
        console.error('Erro ao renderizar perfil:', err);
        res.status(500).send('Erro ao renderizar perfil');
    }
});


async function getEvaluatedCompanies(userId) {
    const query = `
        SELECT E.nm_empresa, A.avaliacao, A.ds_comentario, A.cd_cnpj
        FROM Avaliacoes A
        JOIN Empresas E ON A.cd_cnpj = E.cd_cnpj
        WHERE A.id = ?
    `;

    const [results] = await db.promise().query(query, [userId]);
    return results;
}

router.get("/Profile/reviews", loggedIn, async (req, res) => {
    try {
        const userId = req.user.id; // Obter o ID do usuário logado
        const reviews = await getUserReviews(userId); // Chamar a função para obter as avaliações

        res.render("userReviews.ejs", { reviews }); // Renderizar a página com as avaliações
    } catch (err) {
        console.error('Erro ao carregar avaliações do usuário:', err);
        res.status(500).send('Erro ao carregar avaliações');
    }
});

router.post('/Filter', async (req, res) => {
    const { estado, categoria } = req.body;
    try {
        const companies = await Filter(estado, categoria);

        res.json(companies);
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        res.status(500).send('Erro ao aplicar filtros');
    }
});











router.get('/AllCompanies', async (req, res) => {
    try {

        const companies = await getCompaniesCatalog();
        
        res.render('AllCompanies.ejs', { companies });
    } catch (err) {
        console.error('Erro ao obter catálogo de empresas:', err);
        res.status(500).send('Erro ao obter catálogo de empresas');
    }
});



router.post('/verify-code', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.json({ status: 'error', error: 'Código de verificação é necessário.' });
    }

    db.query('SELECT email FROM EmailVerification WHERE verification_code = ? AND expires_at > NOW()', [code], (error, results) => {
        if (error) {
            console.error('Erro ao verificar código:', error);
            return res.json({ status: 'error', error: 'Erro ao verificar código.' });
        }

        if (results.length === 0) {
            return res.json({ status: 'error', error: 'Código inválido ou expirado.' });
        }

        const email = results[0].email;

        db.query('UPDATE EmailVerification SET is_verified = 1 WHERE email = ?', [email], (updateError) => {
            if (updateError) {
                console.error('Erro ao atualizar a verificação:', updateError);
                return res.json({ status: 'error', error: 'Erro ao ativar conta.' });
            }

            res.json({ status: 'success', success: 'Código verificado com sucesso!' });
        });
    });
});




router.post('/Profile/editar', loggedIn, upload.single('imagem'), async (req, res) => {
    const { id, nome, senha } = req.body;
    const imagem = req.file;

    try {
        await updateUserProfile(id, nome, senha, imagem);
        res.redirect('/Profile');
    } catch (err) {
        console.error('Erro ao atualizar informações do perfil:', err);
        res.status(500).send('Erro ao atualizar informações do perfil');
    }
});


// Rota para exibir o perfil da empresa
router.get("/ProfileE", loggedinE, async (req, res) => {
    try {
        const companyId = req.company.cd_cnpj;
        const company = await getCompanyProfile(companyId);

        res.render("ProfileE", { company, imagePath: `/uploads/${company.nome_imagem}`});
    } catch (err) {
        console.error('Erro ao obter informações do perfil da empresa:', err);
        res.status(500).send('Erro ao obter informações do perfil da empresa');
    }
});

// Rota para atualizar informações do perfil da empresa
router.post('/ProfileE/editar', loggedinE, upload.single('imagem'), async (req, res) => {
    const { nome, telefone, ds_site, senha, localizacao } = req.body;
    const imagem = req.file;
    const cd_cnpj = req.company.cd_cnpj;

    try {
        await updateCompanyProfile(cd_cnpj, nome, telefone, ds_site, senha, imagem, localizacao);
        res.redirect('/ProfileE');
    } catch (err) {
        console.error('Erro ao atualizar informações do perfil da empresa:', err);
        res.status(500).send('Erro ao atualizar informações do perfil da empresa');
    }
});

// Rota POST para registrar localização
router.post('/api/registerLocal', async (req, res) => {
    console.log('Dados recebidos:', req.body);
    try {
        await registerLocalizacao(req, res);
    } catch (err) {
        console.error('Erro na rota /api/registerLocal:', err);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/profile/delete', loggedIn, async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    try {
        // Verificar a senha
        db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
            if (error) {
                console.error('Erro ao verificar senha:', error);
                return res.status(500).send('Erro interno do servidor.');
            }

            if (results.length === 0) {
                return res.status(400).send('Usuário não encontrado.');
            }

            const storedPassword = results[0].password;

            // Verifica se a senha fornecida corresponde à armazenada
            if (password === storedPassword) {
                deleteUserById(userId, (deleteError) => {
                    if (deleteError) {
                        console.error('Erro ao excluir conta:', deleteError);
                        return res.status(500).send('Erro ao excluir conta.');
                    }
                    res.clearCookie('user');
                    res.redirect('/');
                });
            } else {
                return res.status(400).send('Senha incorreta.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        res.status(500).send('Erro ao excluir conta.');
    }
});


// Rota para deletar o perfil
router.post('/profile/verify-password', loggedIn, (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
        return res.json({ status: 'error', error: 'Senha é necessária.' });
    }

    db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erro ao verificar senha:', error);
            return res.status(500).json({ status: 'error', error: 'Erro interno do servidor.' });
        }

        if (results.length === 0) {
            return res.json({ status: 'error', error: 'Usuário não encontrado.' });
        }

        const storedPassword = results[0].password;

        // Verifica se a senha fornecida corresponde à armazenada
        if (password === storedPassword) {
            return res.json({ status: 'success', message: 'Senha correta.' });
        } else {
            return res.json({ status: 'error', error: 'Senha incorreta.' });
        }
    });
});

router.post('/profile/verify-passwordE', loggedinE, (req, res) => {
    const { password } = req.body;
    const companyCNPJ = req.company.cd_cnpj; // Supondo que a CNPJ esteja disponível no objeto req.company

    if (!password) {
        return res.json({ status: 'error', error: 'Senha é necessária.' });
    }

    db.query('SELECT password FROM Empresas WHERE cd_cnpj = ?', [companyCNPJ], (error, results) => {
        if (error) {
            console.error('Erro ao verificar senha:', error);
            return res.status(500).json({ status: 'error', error: 'Erro interno do servidor.' });
        }

        if (results.length === 0) {
            return res.json({ status: 'error', error: 'Empresa não encontrada.' });
        }

        const storedPassword = results[0].password;

        // Verifica se a senha fornecida corresponde à armazenada
        if (password === storedPassword) {
            return res.json({ status: 'success', message: 'Senha correta.' });
        } else {
            return res.json({ status: 'error', error: 'Senha incorreta.' });
        }
    });
});

router.post('/profile/deleteE', loggedinE, (req, res) => {
    const companyId = req.company.cd_cnpj;

    deleteCompanyByCNPJ(companyId, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao excluir conta.');
        }
        // Limpar os cookies após a exclusão da conta
        res.clearCookie('company');
        res.clearCookie('session'); // Se você usa cookies para sessão
        res.redirect('/');
    });
});

 


// Rota para exibir o formulário de registro
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./public/" });
});

router.get("/registerE", (req, res) => {
    res.sendFile("registerE.html", { root: "./public/" });
});

router.get("/registerlocal", (req, res) => {
    res.sendFile("registerLocal.html", { root: "./public/" });
});


router.get("/AllCompanies", (req, res) => {
    res.render("AllCompanies", { root: "./views/" });
});




router.post('/submit-categorias', (req, res) => {
    const { categoria } = req.body;
    const cd_cnpj = req.session.cd_cnpj; // Lê o CNPJ do cookie

    if (!cd_cnpj) {
        return res.status(400).json({ message: 'CNPJ não encontrado nos cookies.' });
    }

    const sql = 'INSERT INTO CategoriaEmpresa (cd_cnpj, nm_categoria) VALUES (?, ?)';
    db.query(sql, [cd_cnpj, categoria], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao inserir categoria.' });
        }
        // Redireciona para a página desejada após a inserção
        res.redirect('/loginE'); // Substitua '/pagina-desejada' pela URL desejada
    });
});




// Rota para exibir o formulário de login
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "./public/" });
});

router.get("/Categorias", (req, res) => {
    res.sendFile("categorias.html", { root: "./public/" });
});


router.get("/LoginE", (req, res) => {
    res.sendFile("loginE.html", { root: "./public/" });
});

router.get("/Profile", (req, res) => {
    res.render("Profile.ejs", { root: "./views/" });
});


router.get('/DashboardUser', loggedinE,(req, res) => {
  
    const cd_cnpj = req.company.cd_cnpj; // Altere conforme necessário

    if (!cd_cnpj) {
        return res.status(401).send('Usuário não autenticado');
    }

    const sql = 'SELECT * FROM imagensCarrossel WHERE cd_cnpj = ? LIMIT 4';
    db.query(sql, [cd_cnpj], (err, results) => {
        if (err) throw err;
        res.render('dashboard.User.ejs', { imagens: results }); // Passa os resultados para o template
    });
});

router.post('/upload-imagens', upload.fields([{ name: 'imagem_0' }, { name: 'imagem_1' }, { name: 'imagem_2' }, { name: 'imagem_3' }]), loggedinE,(req, res) => {
    const cd_cnpj = req.company.cd_cnpj; // Substitua por como você obtém o CNPJ
    const imagens = req.files;

    if (imagens) {
        Object.keys(imagens).forEach(key => {
            imagens[key].forEach(imagem => {
                const nomeImagem = imagem.filename;
                db.query('INSERT INTO imagensCarrossel (cd_cnpj, nome) VALUES (?, ?)', [cd_cnpj, nomeImagem], (err, result) => {
                    if (err) throw err;
                });
            });
        });
    }

    res.redirect('/DashboardUser'); // Redireciona após o upload
});






router.get("/Choose", (req, res) => {
    res.render("Choose.ejs", { root: "./views/" });
});


// Rota para registro de empresa via API
router.post("/api/registerEmpresa", registerEmpresa);
router.post("/api/register/", register)

// Rota para logout
router.get("/logout", logout);




// ---------------------------------------SESSÃO DASHBOARD----------------------------------------------------------------------------------------------------------------------//

router.get('/DashboardE', loggedinE, async (req, res) => {
    try {
        const cd_cnpj = req.company.cd_cnpj;

        // Obtém as informações da empresa
        const company = await getCompanyProfile(cd_cnpj);
        const companyImagePath = (company && company.nome_imagem) ? `/uploads/${company.nome_imagem}` : '/images/noimage.jpg';

        // Obtém a quantidade de avaliações
        const quantidadeAvaliacoes = await contarAvaliacoes(cd_cnpj);
        const mediaAvaliacoes = await calcularMediaAvaliacoes(cd_cnpj); // Obtém a média

        // Obtém a quantidade de usuários interessados
        const quantidadeUsuariosInteressados = await contarUsuariosInteressados(cd_cnpj);

        // Obtém a lista de usuários interessados
        const usuariosInteressados = await getUsuariosInteressados(cd_cnpj);

        // Obtém as avaliações
        const avaliacoes = await getAvaliacoes(cd_cnpj);

        const localizacao = await getLocalizacao(cd_cnpj)
        console.log(localizacao.rua)
      

      

        // Renderiza o dashboard com as informações
        res.render("dashboardE.ejs", { 
            root: "./views/",
            quantidadeAvaliacoes,
            mediaAvaliacoes,
            quantidadeUsuariosInteressados,
            company,
            companyImagePath,
            usuariosInteressados,
            avaliacoes,
            localizacao // Passa as avaliações para o template
        });
    } catch (err) {
        console.error('Erro ao renderizar o dashboard:', err);
        res.status(500).send('Erro ao renderizar o dashboard');
    }
});




function getLocalizacao(cd_cnpj) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM LocalEmpresa WHERE cd_cnpj = ?';

        db.query(query, [cd_cnpj], (error, results) => {
            if (error) {
                console.error('Erro ao obter localização:', error);
                return reject(error);
            }

            // Verifica se há resultados e retorna o primeiro
            if (results.length > 0) {
                // Supondo que a tabela tem as colunas esperadas
                const { rua, numero, bairro, cidade, estado, cep } = results[0];
                resolve({ rua, numero, bairro, cidade, estado, cep });
            } else {
                // Caso não haja resultados
                resolve(null); // ou você pode rejeitar com um erro
            }
        });
    });
}



function getUsuariosInteressados(cd_cnpj) {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
    u.id, 
    u.nm_users, 
    GROUP_CONCAT(c.nm_categoria SEPARATOR ', ') AS categories, 
    MAX(i.nome) AS profileImage,
    ui.cep,
    ui.estado,
    ui.cidade,
    ui.bairro,
    ui.rua,
    ui.numero
FROM UsersInteressados ui
JOIN users u ON ui.id = u.id
JOIN CategoriaEmpresa c ON ui.categoria_id = c.id
LEFT JOIN imagens i ON u.id = i.id
WHERE ui.cd_cnpj = ?
GROUP BY u.id, u.nm_users, ui.cep, ui.estado, ui.cidade, ui.bairro, ui.rua, ui.numero;

`;

        db.query(query, [cd_cnpj], (error, results) => {
            if (error) {
                console.error('Erro ao obter usuários interessados:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function getAvaliacoes(cd_cnpj) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                a.cd_avaliacao, 
                u.nm_users, 
                a.avaliacao, 
                a.ds_comentario,
                i.nome AS profileImage
            FROM Avaliacoes a
            JOIN users u ON a.id = u.id
            LEFT JOIN imagens i ON u.id = i.id
            WHERE a.cd_cnpj = ?`;

        db.query(query, [cd_cnpj], (error, results) => {
            if (error) {
                console.error('Erro ao obter avaliações:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
}






async function contarUsuariosInteressados(cd_cnpj) {
    const [result] = await db.promise().query('SELECT COUNT(DISTINCT id) AS total_interessados FROM UsersInteressados WHERE cd_cnpj = ?', [cd_cnpj]);
    return result[0].total_interessados;
}




async function contarAvaliacoes(cd_cnpj) {
    const query = `
        SELECT COUNT(*) AS quantidade
        FROM Avaliacoes
        WHERE cd_cnpj = ?;
    `;

    const [results] = await db.promise().query(query, [cd_cnpj]);
    
    return results[0].quantidade || 0; // Retorna 0 se não houver avaliações
}

async function calcularMediaAvaliacoes(cd_cnpj) {
    const query = `
        SELECT AVG(avaliacao) AS media
        FROM Avaliacoes
        WHERE cd_cnpj = ?`;

    const [results] = await db.promise().query(query, [cd_cnpj]);
    return results[0].media || 0; // Retorna 0 se não houver avaliações
}



//-----------------------------------------------------------------------------------------------------SESSÃO PERFIL DA EMPRESA------------------------------------------------------------------------








module.exports = router;

