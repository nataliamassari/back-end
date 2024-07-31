var createError = require("http-errors");
var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var session = require("express-session");
const fs = require('fs');
const bodyParser = require('body-parser');
var LocalStrategy = require("passport-local").Strategy;

var dotenv = require('dotenv');

var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

dotenv.config();

var app = express();

// view engine setup
var mustacheExpress = require("mustache-express");
const { url } = require("inspector");
var engine = mustacheExpress();
app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "#@A4327Asdzw",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

function getClassification(num) {
  switch (num) {
    case "1":
      return "A";
    case "2":
      return "B";
    case "3":
      return "C";
    case "4":
      return "D";
    default:
      return "Desconhecido";
  }
}

// crud
app.get('/page/:id', (req, res) => {
  const dataPath = path.join(__dirname, './data.json');
  const pages = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const page = pages.find(p => p.url === req.params.id);
  if (page) {
    page.classificationText = getClassification(page.classification);
    res.render("page", { page });
  } else {
    res.status(404).send('Página não encontrada');
  }
});

app.post('/add', (req, res) => {
  const newItem = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Erro ao ler o arquivo', err);
          return res.status(500).send('Erro ao ler o arquivo');
      }

      let array = [];

      if (data) {
          array = JSON.parse(data);
      }

      array.push(newItem);

      fs.writeFile('data.json', JSON.stringify(array, null, 2), (err) => {
          if (err) {
              console.error('Erro ao escrever no arquivo', err);
              return res.status(500).send('Erro ao escrever no arquivo');
          }

          res.status(200).send('Item adicionado com sucesso');
      });
  });
});

app.post('/edit/:id', (req, res) => {
  const { url, imgUrl, description, classification, name } = req.body;
  const dataPath = path.join(__dirname, './data.json');

  // Ler o arquivo JSON
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo', err);
      return res.status(500).send('Erro ao ler o arquivo');
    }

    let pages = [];

    if (data) {
      pages = JSON.parse(data);
    }

    // Encontrar o índice da página a ser editada
    const pageIndex = pages.findIndex(p => p.url === req.params.id);
    if (pageIndex !== -1) {
      // Atualizar a página
      pages[pageIndex] = { ...pages[pageIndex], url, imgUrl, description, classification, name };

      // Escrever as mudanças de volta ao arquivo JSON
      fs.writeFile(dataPath, JSON.stringify(pages, null, 2), (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo', err);
          return res.status(500).send('Erro ao escrever no arquivo');
        }

        // Redirecionar para a página editada com o novo URL
        res.redirect(`/page/{{url}}`);
      });
    } else {
      res.status(404).send('Página não encontrada');
    }
  });
});


// Middleware para erros 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
