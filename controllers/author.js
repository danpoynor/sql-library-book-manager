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
    if (error.name === 'SequelizeValidationError') {
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
    const authors = await Author.findAll({
      order: [['first_name', 'DESC']],
      include: [
        {
          model: Book
        }
      ]
    });
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
    if (error.name === 'SequelizeValidationError') {
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
