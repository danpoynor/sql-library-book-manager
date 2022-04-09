const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//
// Configure Sequelize and Connect to the Database
//

// Sequelize uses a constructor function to connect to a database.
// This creates an instance of Sequelize named 'sequelize' to interact with.
const Sequelize = require('sequelize');
const { uptime } = require('process');
// Connect to the local library.db database
// https://sequelize.org/v7/manual/getting-started.html#connecting-to-a-database
const sequelize = new Sequelize({
  // Specifies the specific version of SQL we're using
  // Distinctive Features Of SQLite: https://www.sqlite.org/different.html
  dialect: 'sqlite',
  // SQLite is a file-based database and doesn't require credentials or a host,
  // you use the storage key to specify the file path or the storage engine for SQLite.
  storage: './library.db',
  // The `host` parameter is required for other databases
  // host: 'localhost'
  // Logging the executed SQL statements is helpful in a development environment
  // because you're able to see exactly what Sequelize is doing with the database.
  // https://sequelize.org/master/manual/getting-started.html#logging
  logging: (...msg) => console.log(msg),
  define: {
    // BUG: These aren't working, so I'm currently repeating in each model for now.
    // See the Sequelize constructor options table description for `options.define` at:
    // https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#:~:text=Model.findAll-,Public%20Constructors,-public%20constructor(database
    // TODO: Need to troubleshoot more and see if an issue was created fro Sequelize.
    underscored: true,
    timestamps: false
  },
  sync: { force: true }
});

// If you're using MySQL, Postgres, MariaDB, or MSSQL, instead of passing each
// parameter separately, you can also just pass the connection URI:
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

//
// Test the Connection
//

// Log out a message indicating that a database connection has/hasn't been established
// https://sequelize.org/v7/manual/getting-started.html#testing-the-connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
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

// Calling `sync()` issues a `CREATE TABLE IF NOT EXISTS` statement,
// which will sync all models and create tables that do not exist
// in the database. In development (or testing), you may want to
// refresh your database tables each time you start your app.
// sequelize.sync();
// Calling `sync({ force: true })` will issue a `DROP TABLE IF EXISTS`
// statement, which completely deletes the table, before issuing
// the `CREATE TABLE IF NOT EXISTS` statement. In other words,
// it will drop a table that exists, each time you start your app,
// and recreate it from the model definition.
// await sequelize.sync({ force: true });

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

app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  // res.locals.user = req.user
  // res.locals.authenticated = !req.user.anonymous
  // res.locals.pagination = {
  //   limit: req.query.limit || 5,
  //   offset: req.query.offset || 0
  // };
  next();
});

//
// In-App Global Vars
//

// The 'app.locals' object has properties that are local variables within the application,
// and will be available in templates rendered with res.render.
// REF: http://expressjs.com/en/4x/api.html#app.locals
app.locals = {
  // Set defaults for pagination when there's no query param values in the url
  // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#limits-and-pagination
  paginator: {
    limit: 6,
    offset: 0
  },
  footer: {
    copyright: {
      text: 'SQL Library Book Manager',
      link: 'https://github.com/danpoynor/sql-library-book-manager',
      author: 'Dan Poynor',
      year: new Date().getFullYear()
    }
  }
};

app.use((req, res, next) => {
  // Use the 'res.locals' property to set variables accessible in templates rendered with res.render.
  // The variables set on res.locals are available within a single request-response cycle,
  // and will not be shared between requests.
  //
  // This property is useful for exposing request-level information such as the request
  // path name, authenticated user, user settings, and so on to templates rendered within the application.
  //
  // Example: Make `user` and `authenticated` available in templates
  // res.locals.user = req.user
  // res.locals.authenticated = !req.user.anonymous
  // REF: http://expressjs.com/en/4x/api.html#res.locals
  //
  // BUG: This doesn't seem to be working.
  // TODO: Need to investigate more and see if an Express issue was already created.
  res.locals.test = 'It works!';
  next();
});

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
  res.render('page-not-found');
});

module.exports = app;
