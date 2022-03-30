var express = require('express');
var router = express.Router();
// var Book = require('../db/models/book');

const db = require('../db');
const { Book } = db.models;

/* GET home page. */
// router.get('/', function (req, res, next) {
//   // res.render('index', { title: 'Express' });
//   // Book.findAll({}).then(function(books) {
//   res.render('index', {
//     title: 'My Bookshelf',
//     books: 'books'
//   });
//   // });
// });

// Display list of all Books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'genre', 'year'],
      order: [['year', 'DESC']]
    });
    res.render('index', { books, title: 'My Bookshelf' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
