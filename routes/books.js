const express = require('express');
const router = express.Router();
const books = require('../controllers/book.js');

const models = require('../db/models');
const { Book } = models;

// NOTE: Route order matters!
// Avoid '/new' being interpreted as '/:id'
// by placing it before the ':id' route.
// /new
// /:id

// Express Router docs https://expressjs.com/en/4x/api.html#router

// Show new Book form
router.get('/new', books.new);

// Save new Book
router.post('/', books.create);

// Retrieve all Book
router.get('/', books.findAll);

// Retrieve single Book with id
router.get('/:id', books.findOne);

// Show edit form for a single Book with id
router.get('/:id/edit', books.edit);

// Update Book with id
router.post('/:id', books.update);

// Show Delete Book confirmation with id
router.get('/:id/delete', books.delete);

// Destroy Book with id
router.post('/:id/delete', books.destroy);

// Delete all Books
router.delete('/', books.deleteAll);

module.exports = router;
