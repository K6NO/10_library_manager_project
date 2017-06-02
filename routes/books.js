const express = require('express');
const router = express.Router();
const Book = require('../models').books;
const Patron = require('../models').patrons;
const Loan = require('../models').loans;


// GET all books
router.get('/', function(req, res, next) {

    //define association - //TODO - maybe this can be moved to the model definition?
    Loan.belongsTo(Book, {foreignKey: 'book_id'});

    let filter = req.query.filter;
    if(filter === 'overdue') {

        Loan.findAll({
            where: {returned_on: {$eq: null}, return_by: {$lt : new Date()}},
            include: [{model : Book, required: true}]
        })
            .then(function (loans) {
                res.render('overdue_books', {loans: loans})
            })
            .catch(function (err) {
                res.sendStatus(500);
            })

    } else if(filter === 'checked_out') {
        Loan.findAll({
            where: {returned_on: {$eq: null}},
            include: [{model: Book, required: true}]
        })
            .then(function (loans) {
                res.render('checked_books', {loans: loans})
            })
            .catch(function (err) {
                res.sendStatus(500);
            })
    } else {
        Book.findAll()
            .then(function (books) {
            res.render('all_books', { books : books});
            })
            .catch(function (err) {
            res.send(500);
        })
    }

});

//GET single book
router.get('/book_detail/:id', function (req, res, next) {
    //define association - //TODO - maybe this can be moved to the model definition?

    Book.findById(req.params.id).then(function (book) {
        Loan.belongsTo(Book, {foreignKey: 'book_id'});
        Loan.belongsTo(Patron, {foreignKey: 'patron_id'});

        Loan.findAll({
                include : [
                    {model: Book, required: true},
                    {model: Patron, required: true}
                ],
                where : {book_id : req.params.id}
            })
            .then(function (loans) {
                res.render('book_detail', {book: book, loans: loans});
            })
            .catch(function (err) {
                res.sendStatus(500);
            });
    })
});

// UPDATE book details - router.put works only if book is returned!!!
router.post('/book_detail/:id', function (req, res, next) {
    console.log(req.params.id);
    Book.findById(req.params.id)
        .then(function (book) {
            return book.update(req.body);
    })
        .then(function () {
            res.redirect('/books');
        })
        .catch(function (err) {
            if(err.name === 'SequelizeValidationError'){

                // TODO check if associations can be moved to model
                Loan.belongsTo(Book, {foreignKey: 'book_id'});
                Loan.belongsTo(Patron, {foreignKey: 'patron_id'});

                Loan.findAll({
                        include : [
                            {model: Book, required: true},
                            {model: Patron, required: true}
                        ],
                        where : {book_id : req.params.id}
                    })
                    .then(function (loans) {
                        var book = Book.build(req.body);
                        book.id = req.params.id;
                        res.render('book_detail', {
                            book: book,
                            loans: loans,
                            errors : err.errors});
                    })
                    .catch(function (err) {
                        res.sendStatus(500);
                    });
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
        res.redirect('/books')
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