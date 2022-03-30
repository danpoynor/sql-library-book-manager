const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  models: {}
};

// Add sequelize methods to db objects
db.models.Book = require('./models/book.js')(sequelize);
db.models.Author = require('./models/author.js')(sequelize);
db.models.Genre = require('./models/genre.js')(sequelize);

module.exports = db;
