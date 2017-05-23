const express = require('express');
const router = express.Router();
const Book = require('../models').books;
const Patron = require('../models').patrons;
const Loan = require('../models').loans;


// GET all books
router.get('/', function(req, res, next) {
    Book.findAll().then(function (books) {
        res.render('all_books', { books : books});
    }).catch(function (err) {
        res.send(500);
    })
});

//GET single book
router.get('/book_detail/:id', function (req, res, next) {
    Book.findById(req.params.id).then(function (book) {
        if(book){
            res.render('book_detail', {
                book : book
            })
        } else {
            res.send(404);
        }
    }).catch(function (err) {
        res.send(500);
    })
});

// UPDATE book details - router.put resultes in 404 error
router.post('/book_detail/:id', function (req, res, next) {
    console.log(req.params.id);
    Book.findById(req.params.id)
        .then(function (book) {
            console.log(book);
        if (book){
            return book.update(req.body);
        } else {
            res.send(404);
        }
    })
        .then(function (book) {
            res.redirect('/books/book_detail/' + book.id);
        })
        .catch(function (err) {
            if(err.name === 'SequelizeValidationError'){
                var book = Book.build(req.body);
                book.id = req.params.id;
                res.render('/book_detail/' + book.id, {
                    book : book,
                    errors : err.errors
                })
            } else {
                throw err;
            }
    }).catch(function (err) {
        res.send(500);
    })
});

// new book
router.get('/new', function (req, res, next) {
    res.render('new_book', { book : Book.build()})
});

// POST save new book
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