var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const dotenv = require('dotenv');

// Inicialize a aplicação express
var app = express();

dotenv.config();
// Configure a sessão
app.use(session({
  secret: '$A1B2D4!A',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Defina como 'true' se estiver usando HTTPS
}));

// Configure o mustache-express
const mustacheExpress = require('mustache-express');
const engine = mustacheExpress();
app.engine('mustache', engine);

// Configure o view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Importar rotas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Usar rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
