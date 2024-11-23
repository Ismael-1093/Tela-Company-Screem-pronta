const express = require("express");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const db = require("./routes/db-config");
const bodyParser = require("body-parser")


const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
    secret: 'ucbehbch3eihciu3ehc834yhepjxskzapzsSxawhdvex3ygcqfJFDDC', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'cd_cnpj', 
        maxAge: 24 * 60 * 60 * 1000,
        secure: false, 
        httpOnly: true,
    }
}));




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/css", express.static(__dirname + "/views/css"));
app.use("/js", express.static(__dirname + "/views/js"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/imagens filtro", express.static(__dirname + "/public/imagens filtro"));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`e que Viva Cristo Rei!`);
});

//lmao

/* <div id="categoriaModal" class="custom-modal" style="display: none;">
        <div class="custom-modal-dialog">
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h5 id="categoriaModalLabel">Selecione suas Categorias de Interesse</h5>
                    <button type="button" class="close" onclick="closeModal()">&times;</button>
                </div>
            <br>
                <div class="custom-modal-body">
                    <form id="categoriaForm" class="grid-form">
                        <% Company.categorias.forEach(categoria => { %>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="categoria" value="<%= categoria.id %>" id="categoria-<%= categoria.id %>" data-name="<%= categoria.name %>">
                                <label class="form-check-label" for="categoria-<%= categoria.id %>">
                                    <%= categoria.name %>
                                </label>
                            </div>
                        <% }); %>
                        <input type="hidden" id="selectedCategoryName" name="selectedCategoryName">
    
                        <div class="form-group">
                            <label for="userEmail">Seu Email:</label>
                            <input type="email" class="form-control" value="<%= user ? user.email : '' %>" id="userEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="cep">CEP:</label>
                            <input type="text" class="form-control" id="cep" maxlength="10" required>
                            <div class="invalid-feedback" id="cepError">CEP inválido. Tente novamente.</div>
                        </div>
                        <div class="form-group">
                            <label for="estado">Estado:</label>
                            <input type="text" class="form-control" id="estado" required>
                        </div>
                        <div class="form-group">
                            <label for="cidade">Cidade:</label>
                            <input type="text" class="form-control" id="cidade" required>
                        </div>
                        <div class="form-group">
                            <label for="bairro">Bairro:</label>
                            <input type="text" class="form-control" id="bairro" required>
                        </div>
                        <div class="form-group">
                            <label for="rua">Rua:</label>
                            <input type="text" class="form-control" id="rua" required>
                        </div>
                        <div class="form-group">
                            <label for="numero">Número:</label>
                            <input type="text" class="form-control" id="numero" required>
                        </div>
                    </form>
                </div>
                <div class="custom-modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Fechar</button>
                    <button type="button" class="btn btn-primary" id="sendEmailButton">Enviar</button>
                </div>
            </div>
        </div>
    </div>*/