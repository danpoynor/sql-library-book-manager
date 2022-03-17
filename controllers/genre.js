const models = require('../db/models');
const { Book, Genre } = models;

// Show new Genre form
exports.new = async (req, res) => {
  res.render('genres/new', {
    genre: {},
    title: 'New Genre'
  });
};

// Save new Genre
exports.create = async (req, res) => {
  let genre;
  try {
    genre = await Genre.create(req.body);
    res.redirect('/genres/' + genre.id);
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      genre = await Genre.build(req.body);
      res.render('genres/new', {
        genre,
        errors: error.errors,
        title: 'New Genre'
      });
    } else {
      throw error;
    }
  }
};

// Retrieve all Genres from the database
exports.findAll = async (req, res, next) => {
  try {
    const genres = await Genre.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: Book
        }
      ]
    });
    res.render('genres/index', {
      genres,
      title: 'Genre List'
    });
  } catch (err) {
    next(err);
  }
};

// Find single Genre with an id
exports.findOne = async (req, res, next) => {
  try {
    const genre = await Genre.findByPk(req.params.id, {
      include: [
        {
          model: Book
        }
      ]
    });
    res.render('genres/details', {
      title: `Genre Detail: ${genre.name}`,
      genre: genre
    });
  } catch (err) {
    next();
  }
};

// Edit Genre by the id in the request
exports.edit = async (req, res, next) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    res.render('genres/edit', {
      genre,
      title: 'Update Genre'
    });
  } else {
    next();
  }
};

// Update Genre by the id in the request
exports.update = async (req, res, next) => {
  let genre;
  try {
    genre = await Genre.findByPk(req.params.id);
    if (genre) {
      await genre.update(req.body);
      res.redirect('/genres/' + genre.id);
    } else {
      next();
    }
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      genre = await Genre.build(req.body);
      genre.id = req.params.id;
      res.render('genres/edit', { genre, errors: error.errors, title: 'Edit Genre' });
    } else {
      throw error;
    }
  }
};

// Delete Genre with the specified id in the request
exports.delete = async (req, res, next) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    res.render('genres/delete', {
      genre,
      title: 'Delete Genre'
    });
  } else {
    next();
  }
};

// Destroy Genre with the specified id in the request
exports.destroy = async (req, res, next) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    await genre.setBooks(null);
    await genre.destroy();
    res.redirect('/genres');
  } else {
    next();
  }
};

// Delete all Genres from the database.
exports.deleteAll = async (req, res) => {
  res.send('NOT IMPLEMENTED: Handle delete ALL Genres on POST');
};
