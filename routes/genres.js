const express = require('express');
const router = express.Router();
const genres = require('../controllers/genre.js');

const db = require('../db');
const { Genre } = db.models;

// Show new Genre form
router.get('/new', genres.new);

// Save new Genre
router.post('/new', genres.create);

// Retrieve all Genre
router.get('/', genres.findAll);

// Retrieve single Genre with id
router.get('/:id', genres.findOne);

// Show edit form for a single Genre with id
router.get('/:id/edit', genres.edit);

// Update Genre with id
router.post('/:id', genres.update);

// Show Delete Genre confirmation with id
router.get('/:id/delete', genres.delete);

// Destroy Genre with id
router.post('/:id/delete', genres.destroy);

// Delete all Genres
router.post('/', genres.deleteAll);

module.exports = router;
