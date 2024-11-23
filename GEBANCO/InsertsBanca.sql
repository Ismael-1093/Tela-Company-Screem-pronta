INSERT INTO Empresas (cd_cnpj, nm_empresa, email, password, telefone, dt_fundacao, ds_site) VALUES
("19224852000190", "TRANSUNIAO TRANSPORTES", "contabilidade@transuniao.com.br", "123", "(11) 36784141", "2013-11-08", "https://www.transuniao.com.br/site/"),
("54834007001100", "EsseMaga", "EsseMaga@gmail.com", "EsseMagaSenha", "(21) 1234-5678", "1920-01-01", "https://smagalhaes.com.br/"),
("87654321000100", "Transportadora Rápida Express", "transportadora.rapida@example.com", "senha456", "(11) 98765-4321", "2008-03-20", "http://transportadorarapida.com"),
("13579246000100", "Transportes Ágeis LTDA", "transportes.ageis@example.com", "senha789", "(21) 1234-5678", "2015-10-10", "http://transportesageis.com"),
("11223344000155", "Expresso Veloz Ltda", "dcvictorferreira@gmail.com", "senha123", "(11) 1122-3344", "2005-07-15", "http://expressoveloz.com"),
("22334455000166", "Logística Ágil S/A", "contato@logisticaagil.com", "senha456", "(31) 2233-4455", "2010-12-05", "http://logisticaagil.com"),
("33445566000177", "Transportes Rápidos Ltda", "contato@transportesrapidos.com", "senha789", "(41) 3344-5566", "2014-04-20", "http://transportesrapidos.com"),
("44556677000188", "Logística Integrada Ltda", "contato@logisticaintegrada.com", "senhaabc", "(51) 4455-6677", "2000-02-10", "http://logisticaintegrada.com"),
("55667788000199", "Express Transportadora ", "contato@expresstransportadora.com", "senhaxyz", "(61) 5566-7788", "2002-09-30", "http://expresstransportadora.com"),
("66778899000100", "Transglobal Logística Ltda", "contato@transglobal.com", "senha1234", "(11) 6677-8899", "2012-06-25", "http://transglobal.com"),
("77889900000111", "Rápido e Seguro Transportes Ltda", "contato@rapidoeseguro.com", "senha5678", "(11) 7788-9900", "2018-11-12", "http://rapidoeseguro.com"),
("88990011000122", "Logística Flexível Eireli", "contato@logisticaflexivel.com", "senha91011", "(61) 8899-0011", "2007-03-18", "http://logisticaflexivel.com"),
("99001122000133", "Transportadora Sustentável S/A", "contato@transportadorasustentavel.com", "senha121314", "(31) 9900-1122", "2016-08-08", "http://transportadorasustentavel.com"),
("10111213000144", "Logística Eficiente Ltda", "contato@logisticaeficiente.com", "senha151617", "(11) 1011-1234", "2004-05-30", "http://logisticaeficiente.com");


select * from imagensCarrossel where cd_cnpj = "44556677000188" LIMIT 4;

INSERT INTO LocalEmpresa (cd_cnpj, cep, estado, cidade, bairro, rua, numero) VALUES
("19224852000190", "08140-000", "SP", "SÃO PAULO", "Itaim Paulista", "RUA TIBURCIO DE SOUSA", "2478"),
("54834007001100", "04567-890", "RJ", "RIO DE JANEIRO", "Copacabana", "AVENIDA ATLANTICA", "1234"),
("87654321000100", "01310-100", "SP", "SÃO PAULO", "Centro", "RUA XV DE NOVEMBRO", "987"),
("13579246000100", "22010-001", "RJ", "RIO DE JANEIRO", "Botafogo", "RUA SÃO CLEMENTE", "456"),
("11223344000155", "70040-020", "DF", "BRASÍLIA", "Asa Sul", "QSG 8 Bloco D", "505"),
("22334455000166", "30120-001", "MG", "BELO HORIZONTE", "Centro", "AVENIDA Afonso Pena", "200"),
("33445566000177", "84010-000", "PR", "CURITIBA", "Centro", "RUA BARÃO DO SERRO AZUL", "300"),
("44556677000188", "97010-001", "RS", "SANTA MARIA", "Centro", "RUA do Acampamento", "125"),
("55667788000199", "80010-010", "PR", "CURITIBA", "Rebouças", "RUA PROFESSOR PEDRO VIRIATO PARIGOT", "1500"),
("66778899000100", "01000-000", "SP", "SÃO PAULO", "Vila Madalena", "RUA DO CAMPO BELO", "2500"),
("77889900000111", "88888-888", "SP", "SÃO PAULO", "Jardim Paulista", "RUA DAS PERDIZES", "4500"),
("88990011000122", "70000-000", "DF", "BRASÍLIA", "Asa Norte", "SQWN 106 Bloco E", "110"),
("99001122000133", "30160-100", "MG", "BELO HORIZONTE", "Savassi", "RUA DO AMPARO", "999"),
("10111213000144", "01000-000", "SP", "SÃO PAULO", "Lapa", "RUA BARÃO DE ITAPETININGA", "789");

-- Inserindo categorias de transporte de carga para as empresas existentes

INSERT INTO CategoriaEmpresa (cd_cnpj, nm_categoria) 
VALUES 
-- Categorias para "TRANSUNIAO TRANSPORTES"
("19224852000190", "Transporte de Carga Geral"),
("19224852000190", "Transporte de Carga Frigorificada"),

-- Categorias para "EsseMaga"
("54834007001100", "Transporte de Carga Geral"),
("54834007001100", "Transporte de Carga Perigosa"),

-- Categorias para "Transportadora Rápida Express"
("87654321000100", "Transporte de Carga Geral"),
("87654321000100", "Transporte de Carga Volumosa"),

-- Categorias para "Transportes Ágeis LTDA"
("13579246000100", "Transporte de Carga Geral"),
("13579246000100", "Transporte de Carga Líquida"),

-- Categorias para "Expresso Veloz Ltda"
("11223344000155", "Transporte de Carga Geral"),
("11223344000155", "Transporte de Carga Perigosa"),

-- Categorias para "Logística Ágil S/A"
("22334455000166", "Transporte de Carga Geral"),
("22334455000166", "Transporte de Carga Frágil"),

-- Categorias para "Transportes Rápidos Ltda"
("33445566000177", "Transporte de Carga Geral"),
("33445566000177", "Transporte de Carga Farmacêutica"),

-- Categorias para "Logística Integrada Ltda"
("44556677000188", "Transporte de Carga Geral"),
("44556677000188", "Transporte de Carga Perecíveis"),

-- Categorias para "Express Transportadora Eireli"
("55667788000199", "Transporte de Carga Geral"),
("55667788000199", "Transporte de Carga Autopeças"),

-- Categorias para "Transglobal Logística Ltda"
("66778899000100", "Transporte de Carga Geral"),
("66778899000100", "Transporte de Carga Cosméticos"),

-- Categorias para "Rápido e Seguro Transportes Ltda"
("77889900000111", "Transporte de Carga Geral"),
("77889900000111", "Transporte de Carga Cosméticos"),

-- Categorias para "Logística Flexível Eireli"
("88990011000122", "Transporte de Carga Geral"),
("88990011000122", "Transporte de Carga Perecíveis"),

-- Categorias para "Transportadora Sustentável S/A"
("99001122000133", "Transporte de Carga Geral"),
("99001122000133", "Transporte de Carga Preciosa"),

-- Categorias para "Logística Eficiente Ltda"
("10111213000144", "Transporte de Carga Geral"),
("10111213000144", "Transporte de Carga Líquida");


INSERT INTO imagensE (cd_cnpj, nome) VALUES
    ('19224852000190', '1724005084093-logo1.jpg'),
    ('54834007001100', '1724005098375-logo2.jpg'),
    ('87654321000100', '1724005116135-logo3.jpg'),
    ('13579246000100', '1724005132733-logo4.jpg'),
    ('11223344000155', '1724005157773-logo5.png'),
    ('22334455000166', '1724005178591-logo6.jpg'),
    ('33445566000177', '1724005192972-logo7.jpg'),
    ('44556677000188', '1724005210857-logo8.jpg'),
    ('55667788000199', '1724005231846-logo9.jpg'),
    ('66778899000100', '1724005255202-logo10.png'),
    ('77889900000111', '1724005270556-logo11.jpg'),
    ('88990011000122', '1724005284540-logo12.jpg'),
    ('99001122000133', '1724005308113-logo13.jpg'),
    ('10111213000144', '1724005323348-logo14.jpg');



insert into imagensCarrossel(id, cd_cnpj, nome) values

(1, "19224852000190", "1729704383870-caminhao5.jpg"),
(2, "19224852000190", "1729704383870-caminhao5.jpg"),
(3, "19224852000190", "1729704383870-caminhao5.jpg"),
(4, "19224852000190", "1729704383870-caminhao5.jpg"),

(5, "44556677000188",  "1729704383870-caminhao5.jpg"),
(6, "44556677000188",  "1729704383870-caminhao5.jpg"),
(7, "44556677000188",  "1729704383870-caminhao5.jpg"),
(8, "44556677000188", "1729704383870-caminhao5.jpg"),

(9, "55667788000199", "1729704383870-caminhao5.jpg"),
(10, "55667788000199", "1729704383870-caminhao5.jpg"),
(11, "55667788000199", "1729704383870-caminhao5.jpg"),
(12, "55667788000199", "1729704383870-caminhao5.jpg"),

(13, "22334455000166", "1729704383870-caminhao5.jpg"),
(14, "22334455000166", "1729704383870-caminhao5.jpg"),
(15, "22334455000166", "1729704383870-caminhao5.jpg"),
(16, "22334455000166", "1729704383870-caminhao5.jpg"),

(17, "44556677000188", "1729704383870-caminhao5.jpg"),
(18, "44556677000188", "1729704383870-caminhao5.jpg"),
(19, "44556677000188", "1729704383870-caminhao5.jpg"),
(20, "44556677000188", "1729704383870-caminhao5.jpg"),

(21, "77889900000111", "1729704383870-caminhao5.jpg"),
(22, "77889900000111", "1729704383870-caminhao5.jpg"),
(23, "77889900000111", "1729704383870-caminhao5.jpg"),
(24, "77889900000111", "1729704383870-caminhao5.jpg"),

(25, "33445566000177", "1729704383870-caminhao5.jpg"),
(26, "33445566000177", "1729704383870-caminhao5.jpg"),
(27, "33445566000177", "1729704383870-caminhao5.jpg"),
(28, "33445566000177", "1729704383870-caminhao5.jpg"),

(29, "22334455000166", "1729704383870-caminhao5.jpg"),
(30, "22334455000166", "1729704383870-caminhao5.jpg"),
(31, "22334455000166", "1729704383870-caminhao5.jpg"),
(32, "22334455000166", "1729704383870-caminhao5.jpg"),

(33, "11223344000155", "1729704383870-caminhao5.jpg"),
(34, "11223344000155", "1729704383870-caminhao5.jpg"),
(35, "11223344000155", "1729704383870-caminhao5.jpg"),
(36, "11223344000155", "1729704383870-caminhao5.jpg"),

(37, "87654321000100", "1729704383870-caminhao5.jpg"),
(38, "87654321000100", "1729704383870-caminhao5.jpg"),
(39, "87654321000100", "1729704383870-caminhao5.jpg"),
(40, "87654321000100", "1729704383870-caminhao5.jpg"),

(41, "66778899000100", "1729704383870-caminhao5.jpg"),
(42, "66778899000100", "1729704383870-caminhao5.jpg"),
(43, "66778899000100", "1729704383870-caminhao5.jpg"),
(44, "66778899000100", "1729704383870-caminhao5.jpg"),

(45, "13579246000100",  "1729704383870-caminhao5.jpg"),
(46, "13579246000100",  "1729704383870-caminhao5.jpg"),
(47, "13579246000100",  "1729704383870-caminhao5.jpg"),
(48, "13579246000100",  "1729704383870-caminhao5.jpg");






INSERT INTO users (nm_users, email, password) VALUES
("Gabriel", "Gabriel@gmail.com", "senha123"),
("Rafael", "Rafael@gmail.com", "senha456"),
("Miguel", "Miguel@gmail.com", "senha789"),
("Justiniano", "Justi@gmail.com", "senha101112"),
("Lucas", "Lucas@gmail.com", "senha131415"),
("Carlos", "Carlos@gmail.com", "senha161718"),
("Fernando", "Fernando@gmail.com", "senha192021"),
("Pedro", "Pedro@gmail.com", "senha222324"),
("Brutus", "Brutus@gmail.com", "senha252627"),
("Gustavo", "Gustavo@gmail.com", "senha282930"),
("Tiago", "tiago@gmail.com", "senha313233"),
("Luciano", "Luciano@gmail.com", "senha343536"),
("Anderson", "Anderson@gmail.com", "senha373839");

INSERT INTO imagens (id, nome) VALUES
    (1, '1723915204521-cara1.jpg'),
    (2, '1723915311096-cara2.jpg'),
    (3, '1723915320313-cara3.jpg'),
    (4, '1723915328598-cara4.jpg'),
    (5, '1723915341488-cara5.jpg'),
    (6, '1723915350292-cara6.jpg'),
    (7, '1723915371094-cara7.jpg'),
    (8, '1723916044820-cara8.jpg'),
    (9, '1723916058037-cara9.jpg'),
    (10, '1723916077238-cara10.jpg'),
    (11, '1723916087485-cara11.jpg'),
    (12, '1723916150011-cara12.jpg'),
    (13, '1723916097618-cara13.jpg');


SELECT 
    E.cd_cnpj,
    E.nm_empresa,
    COALESCE(AVG(A.avaliacao), 0) AS media_avaliacao,
    I.nome AS imagem_nome
FROM 
    Empresas E
LEFT JOIN 
    Avaliacoes A ON E.cd_cnpj = A.cd_cnpj
LEFT JOIN 
    imagensE I ON E.cd_cnpj = I.cd_cnpj
GROUP BY 
    E.cd_cnpj, E.nm_empresa, I.nome;




INSERT INTO Avaliacoes (cd_cnpj, avaliacao, ds_comentario, id) VALUES
("19224852000190", 5.0, 'brutal', 1),
("87654321000100", 4.5, 'Serviço excelente, entregas rápidas', 2),
("13579246000100", 2.0, 'Atrasos frequentes nas entregas', 3),
("22334455000166", 3.5, 'O transporte deixa a desejar', 1),
("11223344000155", 5.0, 'Melhorou muito!', 1),
("22334455000166", 3.0, 'Poderia ser mais eficiente', 2),
("33445566000177", 4.0, 'Ótimo serviço de logística', 3),
("44556677000188", 3.7, 'Entrega dentro do prazo, mas suporte ao cliente pode melhorar', 4),
("55667788000199", 4.8, 'Eficiência e rapidez nas entregas', 5),
("66778899000100", 3.2, 'Alguns atrasos pontuais, mas no geral satisfatório', 6),
("77889900000111", 4.3, 'Segurança e qualidade garantidas', 7);

select * from Avaliacoes;