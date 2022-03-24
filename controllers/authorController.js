var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });
};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: function (callback) {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.author == null) {
        // No results.
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

// Display Author create form on GET.
exports.author_create_get = function (req, res, next) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
// Note: Unlike with the Genre post handler, we don't check whether the Author object already exists before saving it. Arguably we should, though as it is now we can have multiple authors with the same name.
exports.author_create_post = [
  // Validate and sanitize fields.
  // We can daisy chain validators, using withMessage() to specify the error message to display if the previous validation method fails. This makes it very easy to provide specific error messages without lots of code duplication.
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  // We can use the optional() function to run a subsequent validation only if a field has been entered (this allows us to validate optional fields). For example, below we check that the optional date of birth is an ISO8601-compliant date (the checkFalsy flag means that we'll accept either an empty string or null as an empty value).
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
  // The controller gets the id of the Author instance to be deleted from the URL parameter (req.params.id).
  // It uses the async.parallel() method to get the author record and all associated books in parallel.
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: function (callback) {
        Book.find({ author: req.params.id }).exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Note: If findById() returns no results the author is not in the database. In this case there is nothing to delete, so we immediately render the list of all authors.
      if (results.author == null) {
        // No results.
        res.redirect('/catalog/authors');
      }
      // When both operations have completed it renders the author_delete.pug view, passing variables for the title, author, and author_books.
      // Successful, so render.
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {
  async.parallel(
    {
      // First we validate that an id has been provided (this is sent via the form body parameters, rather than using the version in the URL).
      // Note: We could check if the call to findById() returns any result, and if not, immediately render the list of all authors. We've left the code as it is above for brevity (it will still return the list of authors if the id is not found, but this will happen after findByIdAndRemove()).
      author: function (callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      // Then we get the author and their associated books in the same way as for the GET route.
      authors_books: function (callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.authors_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.authors_books
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect('/catalog/authors');
        });
      }
    }
  );
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};
