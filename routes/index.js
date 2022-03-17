var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  Book.findAll({}).then(function(books) {
    res.render('index', {
      title: 'My Bookshelf',
      books: books
    });
  });
});

module.exports = router;
