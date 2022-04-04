const express = require('express');
const router = express.Router();
const authors = require('../controllers/author.js');

const db = require('../db');
const { Author } = db.models;

// Show new Author form
router.get('/new', authors.new);

// Save new Author
router.post('/', authors.create);

// Retrieve all Author
router.get('/', authors.findAll);

// Retrieve single Author with id
router.get('/:id', authors.findOne);

// Show edit form for a single Author with id
router.get('/:id/edit', authors.edit);

// Update Author with id
router.post('/:id', authors.update);

// Show Delete Author confirmation with id
router.get('/:id/delete', authors.delete);

// Destroy Author with id
router.post('/:id/delete', authors.destroy);

// Delete all Authors
router.delete('/', authors.deleteAll);

module.exports = router;
