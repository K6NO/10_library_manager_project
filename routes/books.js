var express = require('express');
var router = express.Router();
var Book = require('../models').books;


router.get('/', function(req, res, next) {
    Book.findAll().then(function (books) {
        res.render('all_books', { books : books});
    }).catch(function (err) {
        res.send(500);
    })
});

router.get('/new', function (req, res, next) {
    res.render('new_book', { book : Book.build()})
});

router.post('/new', function (req, res, next) {
    console.log(req.body);
    Book.create(req.body)
        .then(function (book) {
        res.render('book_detail', { book: book})
    })
        .catch(function (err) {
            if (err === 'SequelizeValidationError'){
                res.render('new_book', {
                    book : Book.build(req.body),
                    errors : err.errors
                })
            } else {
                throw err;
            }
        })
        .catch(function (err) {
            res.send(500);
        })
});


module.exports = router;