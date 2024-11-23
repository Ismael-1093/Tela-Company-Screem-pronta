const db = require("../../routes/db-config");
const axios = require("axios");

// Substitua pela sua chave de API do OpenCage ou Google Maps
const GEOCODING_API_KEY = 'a1c7e5df46d249199e302b8e338f2a18';

const registerLocalizacao = async (req, res) => {
    const { cep, endereco, numero, bairro, cidade, estado } = req.body;
    const cd_cnpj = req.session.cd_cnpj; // Recupera o CNPJ da sessão


    // Verifica se todos os campos obrigatórios estão presentes
    if (!cd_cnpj || !cep || !endereco || !numero || !bairro || !cidade || !estado) {
        return res.json({ status: "error", error: "Por favor, preencha todos os campos." });
    }

    // Verificar se o CEP é válido utilizando o serviço do ViaCEP
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        // Verifica se o CEP foi encontrado nos Correios
        if (data.erro) {
            return res.json({ status: "error", error: "CEP não encontrado ou inválido." });
        }

        // Obter a latitude e longitude usando a API de Geocodificação
        const address = `${endereco}, ${numero}, ${bairro}, ${cidade}, ${estado}, ${cep}`;
        const geoResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${GEOCODING_API_KEY}`);
        const geoData = geoResponse.data;

        if (geoData.results.length === 0) {
            return res.json({ status: "error", error: "Não foi possível obter coordenadas para o endereço fornecido." });
        }

        const { lat, lng } = geoData.results[0].geometry;

        // Inserir dados na tabela LocalEmpresa
        const localInsert = {
            cd_cnpj: cd_cnpj,
            cep: cep,
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            rua: endereco,
            numero: numero,
            lat: lat,
            lng: lng
        };

        const localQuery = 'INSERT INTO LocalEmpresa SET ?';
        db.query(localQuery, localInsert, (localError, localResult) => {
            if (localError) {
                console.error('Erro ao inserir localização da empresa:', localError);
                return res.json({ status: "error", error: "Erro ao inserir localização da empresa." });
            }

            console.log('Localização registrada com sucesso!');
            return res.json({ status: "success", success: "Localização registrada com sucesso!" });
        });

    } catch (error) {
        console.error('Erro ao verificar CEP ou obter coordenadas:', error);
        return res.json({ status: "error", error: "Erro ao verificar CEP ou obter coordenadas." });
    }
};

module.exports = registerLocalizacao;


