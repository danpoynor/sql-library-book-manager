var express = require('express');
var router = express.Router();

/* GET books listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/books', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/books/new', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/books/new', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/books/:id', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/books/:id', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/books/:id/delete', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
