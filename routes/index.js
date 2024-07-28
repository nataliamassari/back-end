var express = require("express");
var router = express.Router();
var lastRoute = 0;
const fs = require('fs');
const path = require('path');


/*session authentication*/
function isLogged (req, res, next) {
  if (req.session && req.session.user) {
    if (lastRoute == 0) {
      return res.render("create")
    } else {
      return res.render("pageManager")
    }
  }
  return res.redirect("/login");
};

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
  let {usuario, senha} = req.body;

  if(usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
    req.session.user = usuario;
    res.render("pageManager");
  } else {
    res.render("login");
  };
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

router.get('/logout', function (req, res, next) {
  if (req.session.user) {
    delete req.session.user
  }
  res.redirect('/')
})

router.get("/create", isLogged, function (req, res, next) {
  lastRoute = 0;
  res.render("create", { title: "create" });
});

router.get("/pageManager", isLogged, function (req, res, next) {
  res.render("pageManager", { title: "pageManager" });
});

module.exports = router;
