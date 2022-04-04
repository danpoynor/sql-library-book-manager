const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//
// Configure Sequelize and Connect to the Database
//
const Sequelize = require('sequelize');
const { uptime } = require('process');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './library.db',
  logging: (...msg) => console.log(msg)
});

//
// Setup Express and the Routes
//

const app = express();
const index = require('./routes/index');
const books = require('./routes/books');
const authors = require('./routes/authors');
const genres = require('./routes/genres');

//
// Setup database models/tables
//

const db = require('./db');
const { Book, Author, Genre } = db.models;

// NOTE: I'm using migrations instead of sync()
// so I can easily reset database tables and data
// sequelize.sync({ alter: true });

//
// View Engine Setup
//

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//
// Middleware
//

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/books', books);
app.use('/authors', authors);
app.use('/genres', genres);

//
// Handle Errors
//

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
