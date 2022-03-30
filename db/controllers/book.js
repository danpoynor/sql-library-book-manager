const db = require('../');
const { Book } = db.models;

// TODO: Check we're specifying exactly which attributes should be saved when
// using either the save() or build() methods anywhere.
// Being able to allow/disallow (or whitelist) columns to update is useful when
// you want to ensure that users cannot pass objects with columns that should not
// be updated via a form, for example).

// Show new Book form
exports.new = async (req, res) => {
  res.render('books/new', {
    book: {},
    title: 'New Book'
  });
};

// Save new Book
exports.create = async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('books/new', {
        book,
        errors: error.errors,
        title: 'New Book'
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      book = await Book.build(req.body);
      res.render('books/new', {
        book,
        errors: error.errors,
        title: 'New Book'
      });
    } else {
      throw error;
    }
  }
};

// Retrieve all Books from the database
exports.findAll = async (req, res, next) => {
  try {
    const books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'genre', 'year'], // return only id, title, author, genre, year
      order: [['year', 'DESC']] // sort by year descending (newest first)
    });
    // res.json(books); // useful when developing
    res.render('books/index', {
      books,
      title: 'Book List'
    });
  } catch (err) {
    next(err);
  }
};

// Find single Book with an id
exports.findOne = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('books/details', {
    book,
    title: 'Book Details'
  });
};

// Edit Book by the id in the request
exports.edit = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/edit', {
      book,
      title: 'Update Book'
    });
  } else {
    res.sendStatus(404);
  }
};

// Update Book by the id in the request
exports.update = async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        year: req.body.year
      });
      res.redirect('/books/' + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
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
    } else if (error.name === 'SequelizeUniqueConstraintError') {
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
exports.delete = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/delete', {
      book,
      title: 'Delete Book'
    });
  } else {
    res.sendStatus(404);
  }
};

// Destroy Book with the specified id in the request
exports.destroy = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  res.send('NOT IMPLEMENTED: Handle delete ALL Books on POST');
};
