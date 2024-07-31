var express = require("express");
var router = express.Router();
const fs = require('fs');
const path = require('path');

const acesso = require("../helpers/auth")

/* pages. */
router.get("/", function (req, res, next) {
  try {
    const dataPath = path.join(__dirname, '../data.json');
    const pages = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.render("index", { pages });
  } catch (err) {
    console.error('Error reading data.json:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/login', function (req, res, next) {
  let {usuario, senha, error} = req.body;

  if(usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
    req.session.user = usuario;
    res.redirect("/pageManager");
  } else {
    res.render("login", {error: "Usuário ou senha incorretos!"});
  };
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

router.get('/logout', function (req, res, next) {
  if (req.session.user) {
    req.session.destroy()
  }
  res.redirect('/')
})

router.get("/create", acesso.isLogged, function (req, res, next) {
  res.render("create", { title: "create" });
});

router.get('/edit/:id', acesso.isLogged, function (req, res, next) {
  res.render('edit')
});

router.get("/pageManager", acesso.isLogged, function (req, res, next) {
  try {
    const dataPath = path.join(__dirname, '../data.json');
    const pages = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.render("pageManager", { pages, title: "Páginas Criadas" });
  } catch (err) {
    console.error('Error reading data.json:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
