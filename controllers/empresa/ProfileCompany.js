const db = require("../../routes/db-config");
const axios = require('axios');

async function getCompanyProfile(companyId) {
    try {
        const query = `SELECT Empresas.*, 
                    imagensE.nome AS nome_imagem,
                    LocalEmpresa.cep,
                    LocalEmpresa.estado,
                    LocalEmpresa.cidade,
                    LocalEmpresa.bairro,
                    LocalEmpresa.rua,
                    LocalEmpresa.numero
                       FROM Empresas
                       LEFT JOIN imagensE ON Empresas.cd_cnpj = imagensE.cd_cnpj
                       LEFT JOIN LocalEmpresa ON Empresas.cd_cnpj = LocalEmpresa.cd_cnpj
                       WHERE Empresas.cd_cnpj = ?`;
        const [result] = await db.promise().query(query, [companyId]);

        if (!result.length) {
            throw new Error('Empresa não encontrada');
        }

        return result[0];
    } catch (err) {
        console.error('Erro ao obter informações do perfil da empresa:', err);
        throw err;
    }
}

async function validateCep(cep) {
    try {
        const cleanedCep = cep.replace(/\D/g, '');

        if (cleanedCep.length !== 8) {
            throw new Error('CEP inválido');
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);

        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao validar o CEP:', error.message);
        throw new Error('Erro ao validar o CEP: ' + error.message);
    }
}

async function updateCompanyProfile(cd_cnpj, nome, telefone, ds_site, senha, imagem, localizacao) {
    try {
        let updateQueries = [];
        let updateParams = [];

        if (localizacao && localizacao.cep) {
            const cepDetails = await validateCep(localizacao.cep);
            localizacao = {
                cep: cepDetails.cep,
                estado: cepDetails.uf,
                cidade: cepDetails.localidade,
                bairro: cepDetails.bairro,
                rua: cepDetails.logradouro,
                numero: localizacao.numero || ''
            };
        } else if (localizacao && !localizacao.cep) {
            // Se o CEP foi apagado, limpar outros campos de localização
            localizacao = {
                cep: null,
                estado: null,
                cidade: null,
                bairro: null,
                rua: null,
                numero: null
            };
        }

        if (nome || telefone || ds_site || senha) {
            const updateCompanyQuery = `
                UPDATE Empresas
                SET nm_empresa = COALESCE(?, nm_empresa),
                    telefone = COALESCE(?, telefone),
                    ds_site = COALESCE(?, ds_site),
                    password = COALESCE(?, password)
                WHERE cd_cnpj = ?`;
            const updateCompanyParams = [nome, telefone, ds_site, senha, cd_cnpj];
            updateQueries.push(updateCompanyQuery);
            updateParams.push(updateCompanyParams);
        }

        if (imagem) {
            const checkImageQuery = 'SELECT cd_cnpj FROM imagensE WHERE cd_cnpj = ?';
            const [imageResult] = await db.promise().query(checkImageQuery, [cd_cnpj]);

            if (imageResult.length > 0) {
                const updateImageQuery = `
                    UPDATE imagensE
                    SET nome = ?, tipo_mime = ?, tamanho = ?, dados_imagem = ?
                    WHERE cd_cnpj = ?`;
                const updateImageParams = [
                    imagem.filename,
                    imagem.mimetype,
                    imagem.size,
                    imagem.buffer,
                    cd_cnpj
                ];
                updateQueries.push(updateImageQuery);
                updateParams.push(updateImageParams);
            } else {
                const insertImageQuery = 'INSERT INTO imagensE SET ?';
                const insertImageParams = {
                    cd_cnpj: cd_cnpj,
                    nome: imagem.filename,
                    descricao: "Imagem de perfil da empresa",
                    tipo_mime: imagem.mimetype,
                    tamanho: imagem.size,
                    dados_imagem: imagem.buffer
                };
                updateQueries.push(insertImageQuery);
                updateParams.push(insertImageParams);
            }
        }

        if (localizacao) {
            const checkLocationQuery = 'SELECT cd_cnpj FROM LocalEmpresa WHERE cd_cnpj = ?';
            const [locationResult] = await db.promise().query(checkLocationQuery, [cd_cnpj]);

            if (locationResult.length > 0) {
                const updateLocationQuery = `
                    UPDATE LocalEmpresa
                    SET cep = COALESCE(?, cep),
                        estado = COALESCE(?, estado),
                        cidade = COALESCE(?, cidade),
                        bairro = COALESCE(?, bairro),
                        rua = COALESCE(?, rua),
                        numero = COALESCE(?, numero)
                    WHERE cd_cnpj = ?`;
                const updateLocationParams = [
                    localizacao.cep,
                    localizacao.estado,
                    localizacao.cidade,
                    localizacao.bairro,
                    localizacao.rua,
                    localizacao.numero,
                    cd_cnpj
                ];
                updateQueries.push(updateLocationQuery);
                updateParams.push(updateLocationParams);
            } else {
                const insertLocationQuery = 'INSERT INTO LocalEmpresa SET ?';
                const insertLocationParams = {
                    cd_cnpj: cd_cnpj,
                    cep: localizacao.cep,
                    estado: localizacao.estado,
                    cidade: localizacao.cidade,
                    bairro: localizacao.bairro,
                    rua: localizacao.rua,
                    numero: localizacao.numero
                };
                updateQueries.push(insertLocationQuery);
                updateParams.push(insertLocationParams);
            }
        } else {
            // Se não há dados de localização, remover a entrada de localização
            const deleteLocationQuery = 'DELETE FROM LocalEmpresa WHERE cd_cnpj = ?';
            updateQueries.push(deleteLocationQuery);
            updateParams.push([cd_cnpj]);
        }

        await db.promise().beginTransaction();

        for (let i = 0; i < updateQueries.length; i++) {
            await db.promise().query(updateQueries[i], updateParams[i]);
        }

        await db.promise().commit();
        
        console.log('Informações de empresa atualizadas com sucesso');
    } catch (err) {
        await db.promise().rollback();
        console.error('Erro ao atualizar informações da empresa:', err);
        throw err;
    }
}

module.exports = {
    getCompanyProfile,
    updateCompanyProfile
};
