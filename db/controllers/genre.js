const db = require('../');
const { Genre } = db.models;

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
    if (error.name === 'SequelizeValidationError') {
      genre = await Genre.build(req.body);
      res.render('genres/new', {
        genre,
        errors: error.errors,
        title: 'New Genre'
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
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
      attributes: ['id', 'name', 'description'],
      order: [['name', 'DESC']]
    });
    res.render('genres/index', {
      title: 'Genre List',
      genres
    });
  } catch (err) {
    next(err);
  }
};

// Find single Genre with an id
exports.findOne = async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  res.render('genres/details', {
    title: 'Genre Detail',
    genre: genre
  });
};

// Edit Genre by the id in the request
exports.edit = async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    res.render('genres/edit', {
      genre,
      title: 'Update Genre'
    });
  } else {
    res.sendStatus(404);
  }
};

// Update Genre by the id in the request
exports.update = async (req, res) => {
  let genre;
  try {
    genre = await Genre.findByPk(req.params.id);
    if (genre) {
      await genre.update(req.body);
      res.redirect('/genres/' + genre.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      genre = await Genre.build(req.body);
      genre.id = req.params.id;
      res.render('genres/edit', { genre, errors: error.errors, title: 'Edit Genre' });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
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

// Delete Genre with the specified id in the request
exports.delete = async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    res.render('genres/delete', {
      genre,
      title: 'Delete Genre'
    });
  } else {
    res.sendStatus(404);
  }
};

// Destroy Genre with the specified id in the request
exports.destroy = async (req, res) => {
  const genre = await Genre.findByPk(req.params.id);
  if (genre) {
    await genre.destroy();
    res.redirect('/genres');
  } else {
    res.sendStatus(404);
  }
};

// Delete all Genres from the database.
exports.deleteAll = async (req, res) => {
  res.send('NOT IMPLEMENTED: Handle delete ALL Genres on POST');
};
