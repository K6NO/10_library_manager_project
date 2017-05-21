var express = require('express');
var router = express.Router();
var title = 'Library Manager';
var Book = require('../models').Book;


router.get('/', function(req, res, next) {
    Book.findAll().then(function (books) {
        res.render('all_books', { books : books, title: title });
    }).catch(function (err) {
        res.send(500);
    })
});

router.get('/new_book', function (req, res, next) {
    res.render('new_book', { book : Book.build, title: title})
});

router.post('/new_book', function (req, res, next) {
    console.log('POST');
    console.log(req.body);
    Book.create(req.body).then(function (book) {
        res.redirect('book_detail', { book : book, title: title})
    })
});


module.exports = router;