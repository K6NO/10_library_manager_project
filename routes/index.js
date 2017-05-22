var express = require('express');
var router = express.Router();



/* GET details */


router.get('/book_detail', function(req, res, next) {
  res.render('book_detail', { });
});

//router.get('/patron_detail', function(req, res, next) {
//  res.render('patron_detail', { title: title });
//});

/* GET Overdues*/

router.get('/overdue_books', function(req, res, next) {
  res.render('overdue_books', { });
});

router.get('/overdue_loans', function(req, res, next) {
  res.render('overdue_loans', { title: title });
});

/* GET Checked Outs*/

router.get('/checked_books', function(req, res, next) {
  res.render('checked_books', { title: title });
});

router.get('/checked_loans', function(req, res, next) {
  res.render('checked_loans', { title: title });
});

/* Return book*/

router.get('/return_book', function(req, res, next) {
  res.render('return_book', { title: title });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { });
});

module.exports = router;
