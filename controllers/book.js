const models = require('../db/models');
const { Book, Author, Genre } = models;
const Op = models.Sequelize.Op;
const debug = require('debug')('library-manager:controllers:book');

// NOTE: Author and Genre data is stored in separate tables from Books.
// Since I'm using a relational database schema, I refer to an author
// by using an `author_id` foreign key (their `id` in the associated
// `Authors` table) instead of referring to the 'author' column in
// the `Books` table in library.db. Also I use include statements
// to join the data in Finder Queries, such as `findAndCountAll()`:
// `Book.findAndCountAll({ include: [{model: Author},{model: Genre}] }`
// More info: https://sequelize.org/docs/v6/core-concepts/assocs/

// TODO: Check we're specifying exactly which attributes should be saved
// when using either the save() or build() (or create()?) methods anywhere.
// Being able to allow/disallow (or whitelist) which columns to update is useful
// when you want to ensure that users cannot pass objects with columns that
// should not be updated via a form, for example).

// Show new Book form
exports.new = async (req, res) => {
  res.render('books/new', {
    book: {},
    title: 'New Book',
    authors: await Author.findAll(),
    genres: await Genre.findAll()
  });
};

// Save new Book
exports.create = async (req, res) => {
  // NOTE: Keep the next line for devtime debugging
  // to see what the req.body json includes.
  // res.json(req.body);
  // Create a null book var here, so it can be used in the catch block
  let book;
  try {
    book = await Book.create(req.body);
    await book.setGenres(req.body.genres);
    res.redirect('/books/' + book.id);
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      book = await Book.build(req.body);
      res.render('books/new', {
        book,
        errors: error.errors,
        title: 'New Book',
        authors: await Author.findAll(),
        genres: await Genre.findAll()
      });
    } else {
      throw error;
    }
  }
};

// Retrieve all Books from the database
exports.findAll = async (req, res, next) => {
  try {
    const books = await Book.findAndCountAll({
      // When using associated tables (includes) the count can be thrown off.
      // https://github.com/sequelize/sequelize/issues/10557
      // Adding 'distinct: true' fixes so correct count is returned.
      // Could also try adding a global 'beforeCount' hook as mentioned here:
      // https://github.com/sequelize/sequelize/issues/9481#issuecomment-473423369
      distinct: 'Book.id',
      order: [['year', 'DESC']],
      // Set query defaults if no query params are passed
      limit: req.query.limit || 5,
      offset: req.query.offset || 0,
      // NOTE: It's possible to just include all associated tables without having
      // to specify them individually, but for now I specify them individually,
      // so I can customize the `where` clause while debugging.
      // https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#including-everything
      include: { all: true, required: true }
      //
      // NOTE: I had to create a special /search route instead just checking for the query param here.
      // Sequelize has an issue preventing 'limit' working with 'many-to-many' associations
      // https://stackoverflow.com/questions/65803974/how-can-i-limit-many-to-many-relationships-on-sequelize
      // In stead of two-way belongsToMany for Books and Genres, might investigate using belongsToMany
      // width separate: true.
      // https://stackoverflow.com/questions/53186006/how-can-i-use-limit-in-include-model-using-sequelize
      // or consider using Knex or TypeORM instead of Sequelize.
    });
    // res.json(books);
    res.render('books/index', {
      books,
      title: 'Book List',
      // Pass in paginator values based on whatever is in the req.query
      paginator: {
        limit: req.query.limit || 5,
        offset: req.query.offset || 0
      },
      searchPhrase: req.query.search || ''
    });
  } catch (err) {
    // Calls to `next()` and `next(err)` indicate that the current handler is complete
    // and in what state. `next(err)` will skip all remaining handlers in the chain
    // except for those that are set up to handle errors.
    next(err);
  }
};

// Find single Book with an id
exports.findOne = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Author
        },
        {
          model: Genre
        }
      ]
    });
    res.render('books/details', {
      book,
      title: `Book Details: ${book.title}`
    });
  } catch (err) {
    next();
  }
};

// Search Books
exports.searchAll = async (req, res, next) => {
  try {
    let searchParam = '';
    if (req.query.phrase) {
      searchParam = req.query.phrase;
    }
    let filterParamsArray = [];
    let whereArray = [];

    if (!req.query.filter) {
      debug('No filter params in url, so here we search all the fields');
      whereArray.push({
        [Op.or]: [
          { title: { [Op.like]: `%${searchParam}%` } },
          { year: { [Op.like]: `%${searchParam}%` } },
          { '$Author.first_name$': { [Op.like]: `%${searchParam}%` } },
          { '$Author.last_name$': { [Op.like]: `%${searchParam}%` } },
          { '$Genres.name$': { [Op.like]: `%${searchParam}%` } }
        ]
      });
    } else {
      debug('Filter param found. Add a where clause to the query for each filter value');
      const filterParams = req.query.filter;
      filterParamsArray = filterParams.split('|');
      const filterRule = { [Op.like]: `%${searchParam}%` };

      filterParamsArray.forEach((param) => {
        if (param === 'title') {
          let obj = {};
          obj['title'] = filterRule;
          whereArray.push(obj);
        } else if (param === 'year') {
          let obj = {};
          obj['year'] = filterRule;
          whereArray.push(obj);
        } else if (param === 'genre') {
          let obj = {};
          obj['$Genres.name$'] = filterRule;
          whereArray.push(obj);
        } else if (param === 'author') {
          let first = {};
          let last = {};
          first['$Author.first_name$'] = filterRule;
          last['$Author.last_name$'] = filterRule;
          whereArray.push(first, last);
        }
      });
    }

    const books = await Book.findAndCountAll({
      distinct: 'Book.id',
      order: [['year', 'DESC']],
      include: { all: true, required: true, nested: true },
      where: { [Op.or]: whereArray }
    });
    // res.json(books);
    res.render('search/index', {
      books,
      title: 'Search Results',
      searchPhrase: req.query.phrase || '',
      searchFilter: req.query.filter || ''
    });
  } catch (err) {
    next(err);
  }
};

// Edit Book by the id in the request
exports.edit = async (req, res, next) => {
  const book = await Book.findByPk(req.params.id, {
    include: [
      {
        model: Author
      },
      {
        model: Genre
      }
    ]
  });
  if (book) {
    res.render('books/edit', {
      book,
      title: 'Update Book',
      authors: await Author.findAll(),
      genres: await Genre.findAll()
    });
  } else {
    next();
  }
};

// Update Book by the id in the request
exports.update = async (req, res, next) => {
  // res.json(req.body);
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update({
        title: req.body.title,
        // NOTE: Author is referenced by id since author names
        // are stored in an associated/relational table
        author_id: req.body.author_id,
        year: req.body.year
      });
      book.setGenres(req.body.genres);
      res.redirect('/books/' + book.id);
    } else {
      next();
    }
  } catch (error) {
    // TODO: Test these error conditions again.
    // Might need to re-populate the form differently
    // now to show associations content.
    // Try to combine the two error conditions into one.
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      book = await Book.build({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
      });
      book.id = req.params.id;
      res.render('books/edit', {
        book,
        errors: error.errors,
        title: 'Edit Book'
      });
    } else {
      throw error;
    }
  }
};

// Delete Book with the specified id in the request
exports.delete = async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/delete', {
      book,
      title: 'Delete Book'
    });
  } else {
    next();
  }
};

// Destroy Book with the specified id in the request
exports.destroy = async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    // Remove associations before destroying the book
    await book.setAuthor(null);
    await book.setGenres(null);
    await book.destroy();
    res.redirect('/books');
  } else {
    next();
  }
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  res.send('NOT IMPLEMENTED: Handle delete ALL Books on POST');
};
