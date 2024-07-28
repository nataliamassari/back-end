var createError = require("http-errors");
var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
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
