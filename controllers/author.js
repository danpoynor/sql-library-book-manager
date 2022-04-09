const Sequelize = require('sequelize');
const models = require('../db/models');
const { Author, Book } = models;

// Show new Author form
exports.new = async (req, res) => {
  res.render('authors/new', {
    author: {},
    title: 'New Author'
  });
};

// Save new Author
exports.create = async (req, res) => {
  let author;
  try {
    author = await Author.create(req.body);
    res.redirect('/authors/' + author.id);
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      author = await Author.build(req.body);
      res.render('authors/new', {
        author,
        errors: error.errors,
        title: 'New Author'
      });
    } else {
      throw error;
    }
  }
};

// Retrieve all Authors from the database
exports.findAll = async (req, res, next) => {
  try {
    // const authors = await Author.findAll({
    //   include: { all: true }});
    const authors = await Author.findAll({
      // To order the authors by bookCount, use a sub-query
      // to get the associated row count of each author
      // https://sequelize.org/docs/v6/other-topics/sub-queries/#using-sub-queries-for-complex-ordering
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM books AS book
              WHERE
              book.author_id = author.id
            )`),
            'bookCount'
          ]
        ]
      },
      order: [[Sequelize.literal('bookCount'), 'DESC']],
      include: [
        {
          model: Book
        }
      ]
    });
    // res.json(authors);
    res.render('authors/index', {
      authors,
      title: 'Author List'
    });
  } catch (err) {
    next(err);
  }
};

// Find single Author with an id
exports.findOne = async (req, res) => {
  const author = await Author.findByPk(req.params.id, {
    include: [
      {
        model: Book
      }
    ]
  });
  res.render('authors/details', {
    author,
    title: `Author Details: ${author.fullName()}`
  });
};

// Edit Author by the id in the request
exports.edit = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (author) {
    res.render('authors/edit', {
      author,
      title: 'Update Author'
    });
  } else {
    res.sendStatus(404);
  }
};

// Update Author by the id in the request
exports.update = async (req, res) => {
  let author;
  try {
    author = await Author.findByPk(req.params.id);
    if (author) {
      await author.update(req.body);
      res.redirect('/authors/' + author.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      author = await Author.build(req.body);
      author.id = req.params.id;
      res.render('authors/edit', {
        author,
        errors: error.errors,
        title: 'Edit Author'
      });
    } else {
      throw error;
    }
  }
};

// Delete Author with the specified id in the request
exports.delete = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (author) {
    res.render('authors/delete', {
      author,
      title: 'Delete Author'
    });
  } else {
    res.sendStatus(404);
  }
};

// Destroy Author with the specified id in the request
exports.destroy = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (author) {
    await author.setBooks(null);
    await author.destroy();
    res.redirect('/authors');
  } else {
    res.sendStatus(404);
  }
};

// Delete all Authors from the database.
exports.deleteAll = async (req, res) => {
  res.send('NOT IMPLEMENTED: Handle delete ALL Authors on POST');
};
