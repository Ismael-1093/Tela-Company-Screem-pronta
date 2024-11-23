const express = require("express");
const register = require("./user/register");
const registerE = require("./empresa/registerE")
const login = require("./user/login");
const logout = require("./logout");
const loginE = require("./empresa/loginE");



const registerLocalizacao = require("./empresa/registerLocal")
const router = express.Router();

router.post("/registerLocal", registerLocalizacao)
router.post("/loginE", loginE)

router.post("/register", register);
router.post("/registerE", registerE)
router.post("/login", login);
router.post("/logout", logout)


module.exports = router;