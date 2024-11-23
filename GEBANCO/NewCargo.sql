drop database if exists NewCargo;
create database NewCargo;
use NewCargo;


-- LEMBRE SE DE RODAR A PROCEDURE PARA AVLIAÇÕES SE NÃO  FUNCIONAAAAAAA

create table Empresas (
    cd_cnpj varchar(19) primary key,
    nm_empresa varchar(40),
	email varchar(50),
    password varchar(100),
    telefone varchar(20), 
    dt_fundacao date,
    ds_site varchar(255));   
    

create table LocalEmpresa(
	cd_cnpj varchar(19),
    cep varchar(9),
    estado varchar(2),
	cidade varchar(50),
    bairro varchar(50),
    rua varchar(255),
    numero varchar(5),
	lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
	foreign key (cd_cnpj) references Empresas(cd_cnpj) on delete cascade
    );
    
    
CREATE TABLE CategoriaEmpresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cd_cnpj VARCHAR(19),
    nm_categoria VARCHAR(50),
    FOREIGN KEY (cd_cnpj) REFERENCES Empresas(cd_cnpj) ON DELETE CASCADE 
);


    select * from CategoriaEmpresa;

    
	CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nm_users VARCHAR(50),
    email VARCHAR(100) unique,
    password VARCHAR(100));
    
CREATE TABLE UsersInteressados (
    cd INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id INT NOT NULL,
    cd_cnpj VARCHAR(19),
    categoria_id INT, 
	cep varchar(9),
    estado varchar(2),
	cidade varchar(50),
    bairro varchar(50),
    rua varchar(255),
    numero varchar(5),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cd_cnpj) REFERENCES Empresas(cd_cnpj) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES CategoriaEmpresa(id) ON DELETE CASCADE  
);






    
    CREATE TABLE Favoritadas(
    cd int not null primary key auto_increment,
    id int not null, 
    cd_cnpj varchar(19),
    nm_empresa varchar(40),
    foreign key(id) references users(id) on delete cascade,
    foreign key(cd_cnpj) references Empresas(cd_cnpj) on delete cascade
    );


CREATE TABLE EmailVerification (
    email VARCHAR(100) PRIMARY KEY,
    verification_code INT,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);


CREATE TABLE imagens (
    cd INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id INT,
    nome VARCHAR(100),
    descricao TEXT,
    tipo_mime VARCHAR(50),
    tamanho INT,
    dados_imagem LONGBLOB,
    FOREIGN KEY (id) REFERENCES users(id)  on delete cascade
);

CREATE TABLE imagensE (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cd_cnpj varchar(19),
    nome VARCHAR(100),
    descricao TEXT,
    tipo_mime VARCHAR(50),
    tamanho INT,
    dados_imagem LONGBLOB,
    FOREIGN KEY (cd_cnpj) REFERENCES Empresas(cd_cnpj)  on delete cascade
);


CREATE TABLE imagensCarrossel (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cd_cnpj varchar(19),
    nome VARCHAR(100),
    FOREIGN KEY (cd_cnpj) REFERENCES Empresas(cd_cnpj)  on delete cascade
);



create table Avaliacoes (
    cd_avaliacao int not null primary key auto_increment,
    cd_cnpj varchar(19),
    avaliacao decimal(3, 1) check (avaliacao >= 0 AND avaliacao <= 5),
    ds_comentario text,
    id int,
    foreign key (cd_cnpj) references Empresas(cd_cnpj) on delete cascade,
    foreign key (id) references users(id) on delete cascade
)auto_increment = 1;


create table LogUsers (
    log_id int auto_increment primary key,
    log_action varchar(50) not null,
    log_timestamp timestamp default current_timestamp,
    user_id int,
    nm_users varchar(50),
    email varchar(100),
    password varchar(100)
);

    create table LogEmpresas (
    log_id int auto_increment primary key,
    log_action varchar(50) not null,
    log_timestamp timestamp default current_timestamp,
    cd_cnpj varchar(19),
    nm_empresa varchar(40),
    email varchar(50),
    password varchar(100),
    telefone varchar(13),
    dt_fundacao date,
    ds_site varchar(255),
    CEP varchar(8)
); 

CREATE TABLE LogAvaliacoes (
    log_id int auto_increment primary key,
    log_action varchar(50) not null,
    log_timestamp timestamp default current_timestamp,
    cd_avaliacao int,
    cd_cnpj varchar(19),
    avaliacao decimal(3, 1),
    ds_comentario text,
    id int
);



SELECT * FROM users;
SELECT * FROM Empresas;
SELECT * FROM LogEmpresas;
SELECT * FROM LogUsers;
SELECT * FROM Avaliacoes;
SELECT * FROM LogAvaliacoes;





