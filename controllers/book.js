const models = require('../db/models');
const { Book, Author, Genre, BookGenres } = models;
const Op = models.Sequelize.Op;

// TODO: Check we're specifying exactly which attributes should be saved when
// using either the save() or build() methods anywhere.
// Being able to allow/disallow (or whitelist) columns to update is useful when
// you want to ensure that users cannot pass objects with columns that should not
// be updated via a form, for example).

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
  // const { search } = await req.body;
  try {
    // If a search term is provided, build a composed 'where' clause for the query.
    // Eventually this will allow me to add checkboxes for users to select which fields to search.
    let searchParam = '';
    if (req.query.search) {
      searchParam = req.query.search;
    }

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
      // include: { all: true, required: true, nested: true },
      include: [
        {
          model: Author,
          required: true
        },
        {
          model: Genre,
          required: true,
          nested: true,
          subQuery: false
          // https://sequelize.org/v6/manual/model-querying-finders.html#eager-loading-with-include-all
          // https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#eager-loading-filtered-at-the-associated-model-level
          // Works: Inner where clause for filtering the associated Genre table
          // This will return none though if other table queries are also used.
          // where: {
          //   [Op.or]: [{ name: { [Op.like]: `%${searchParam}%` } }]
          // }
        }
      ],
      // Using a top-level where clause
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchParam}%` } },
          { year: { [Op.like]: `%${searchParam}%` } },
          { '$Author.last_name$': { [Op.like]: `%${searchParam}%` } },
          { '$Author.first_name$': { [Op.like]: `%${searchParam}%` } }
          // Doesn't work: Top-level where clause for filtering the associated Genre table
          // { '$Genre.name$': { [Op.like]: `%${searchParam}%` } }
        ]
      }
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
    next(err);
  }
};

// Find single Book with an id
exports.findOne = async (req, res) => {
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
};

// Edit Book by the id in the request
exports.edit = async (req, res) => {
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
    res.sendStatus(404);
  }
};

// Update Book by the id in the request
exports.update = async (req, res) => {
  // res.json(req.body);
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update({
        title: req.body.title,
        author_id: req.body.author_id,
        year: req.body.year
      });
      book.setGenres(req.body.genres);
      res.redirect('/books/' + book.id);
    } else {
      res.sendStatus(404);
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
    // Remove associations before destroying the book
    await book.setAuthor(null);
    await book.setGenres(null);
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
