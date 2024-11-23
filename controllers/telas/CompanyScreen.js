async function getCompanyDetails(req, res) {
    const cd_cnpj = req.params.cd_cnpj;
    try {
        // Consultas SQL
        const queryCompany = 'SELECT * FROM Empresas WHERE cd_cnpj = ?';
        const sqlReviews = `SELECT LogAvaliacoes.*, Users.id AS user_id, Users.nm_users
                            FROM LogAvaliacoes
                            INNER JOIN Users ON LogAvaliacoes.id = Users.id
                            WHERE LogAvaliacoes.cd_cnpj = ?`;
        const queryLocation = 'SELECT * FROM LocalEmpresa WHERE cd_cnpj = ?';
        const queryCategories = 'SELECT id, nm_categoria FROM CategoriaEmpresa WHERE cd_cnpj = ?';  
        const queryImages = 'SELECT * FROM imagensCarrossel WHERE cd_cnpj = ? LIMIT 4'; 
        const queryImagesProfileE = 'SELECT * FROM imagensE WHERE cd_cnpj = ?'; 

        // Execução das consultas
        const [companyResult] = await db.promise().query(queryCompany, [cd_cnpj]);
        const [reviewsResult] = await db.promise().query(sqlReviews, [cd_cnpj]);
        const [locationResult] = await db.promise().query(queryLocation, [cd_cnpj]);
        const [categoriesResult] = await db.promise().query(queryCategories, [cd_cnpj]);
        const [imagesResult] = await db.promise().query(queryImages, [cd_cnpj]); 
        const [QueryResultE] = await db.promise().query(queryImagesProfileE, [cd_cnpj]); 

        if (companyResult.length > 0) {
            const Company = companyResult[0];
            const location = locationResult.length > 0 ? locationResult[0] : {};
            const categories = categoriesResult.map(row => ({
                id: row.id,
                name: row.nm_categoria
            }));
            const images = imagesResult.map(image => `/uploads/${image.nome}`); 

            // Obter imagem da empresa
            const CompanyImagePath = QueryResultE.length > 0 ? `/uploads/${QueryResultE[0].nome}` : '/uploads/noimage.jpg';

            const reviewsWithImages = await Promise.all(reviewsResult.map(async (review) => {
                const [imageResult] = await db.promise().query('SELECT * FROM Imagens WHERE id = ?', [review.user_id]);
                const userImagePath = imageResult.length > 0 ? `/uploads/${imageResult[0].nome}` : '/uploads/noimage.jpg';
                
                return {
                    ...review,
                    userImagePath
                };
            }));

            // Ordena os comentários para que o comentário do usuário logado venha primeiro
            const loggedUserId = req.user ? req.user.id : null;
            if (loggedUserId) {
                reviewsWithImages.sort((a, b) => {
                    if (a.user_id === loggedUserId) return -1; 
                    if (b.user_id === loggedUserId) return 1;  
                    return 0; 
                });
            }

            Company.localizacao = location;
            Company.categorias = categories; 
            Company.images = images || []; // Garante que sempre seja um array

            res.render('CompanyScreen.ejs', {
                company: req.company,
                Company: Company,
                reviews: reviewsWithImages,
                user: req.user,
                categoria: categories, 
                CompanyImagePath,
                referer: req.headers.referer // Captura a URL da página anterior
            });
        } else {
            res.status(404).send('Empresa não encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
}

module.exports = {
    getCompanyDetails
};
