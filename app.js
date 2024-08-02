var createError = require("http-errors");
var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var session = require("express-session");
const fs = require("fs");
const bodyParser = require("body-parser");
var LocalStrategy = require("passport-local").Strategy;
var Joi = require("joi");

var dotenv = require("dotenv");

var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var pageSchema = require("./helpers/valida");

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
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// funçao p/ retornar classificaçoes
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

// CRUD

//Create
app.post("/add", (req, res) => {
  const newItem = req.body;

  const { error } = pageSchema.validate(newItem);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao ler o arquivo" });
    }

    let array = [];

    if (data) {
      array = JSON.parse(data);
    }

    array.push(newItem);

    fs.writeFile("data.json", JSON.stringify(array, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao escrever no arquivo" });
      }

      res.status(200).json({ message: "Item adicionado com sucesso" });
    });
  });
});

// Read
app.get("/page/:id", (req, res) => {
  const dataPath = path.join(__dirname, "./data.json");
  const pages = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const page = pages.find((p) => p.url === req.params.id);
  if (page) {
    page.classificationText = getClassification(page.classification)
    res.render("page", { page })
  } else {
    res.status(404).send("Página não encontrada")
  }
});

// Update
app.post("/editPage", (req, res) => {
  const { url, newData } = req.body;
  const { error, value } = pageSchema.validate(newData);

  if (error) {
    // Extrai todas as mensagens de erro
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao ler o arquivo" });
    }

    let array = [];

    if (data) {
      array = JSON.parse(data);
    }

    const itemIndex = array.findIndex((item) => item.url === url);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    const updatedItem = { ...array[itemIndex], ...newData };

    array[itemIndex] = updatedItem;

    fs.writeFile("data.json", JSON.stringify(array, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao escrever no arquivo" });
      }
      res.status(200).json({ message: "Item editado com sucesso" });
    });
  });
});

// Remove
app.delete("/delete/:url", (req, res) => {
  const { url } = req.params;

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo", err);
      return res.status(500).send("Erro ao ler o arquivo");
    }

    let array = [];

    if (data) {
      array = JSON.parse(data);
    }

    const itemIndex = array.findIndex((item) => item.url === url);

    if (itemIndex === -1) {
      return res.status(404).send("Item não encontrado");
    }

    array.splice(itemIndex, 1);

    fs.writeFile("data.json", JSON.stringify(array, null, 2), (err) => {
      if (err) {
        console.error("Erro ao escrever no arquivo", err);
        return res.status(500).send("Erro ao escrever no arquivo");
      }

      res.status(200).send("Item excluído com sucesso");
    });
  });
});

// Middleware para erros 404
app.use((req, res, next) => {
  res.status(404).send("Not Found");
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
