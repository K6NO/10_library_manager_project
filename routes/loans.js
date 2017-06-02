var express = require('express');
var router = express.Router();
var Loan = require('../models/index').loans;
var Book = require('../models/index').books;
var Patron = require('../models/index').patrons;

router.get('/', function(req, res) {
    // Associations
    Loan.belongsTo(Book, {foreignKey: 'book_id'});
    Loan.belongsTo(Patron, {foreignKey: 'patron_id'});

    let filter = req.query.filter;
    if (filter === 'overdue') {
        Loan.findAll({
            include : [
                {model : Book, required: true},
                {model : Patron, required: true}
            ],
            where : {returned_on: {$eq: null}, return_by: {$lt: new Date()}}
        }).then(function (loans) {
            res.render('all_loans', { loans : loans });
        }).catch(function (err) {
            res.sendStatus(500);
        })
    } else if (filter === 'checked_out') {
        Loan.findAll({
            include : [
                {model : Book, required: true},
                {model : Patron, required: true}
            ],
            where : {returned_on: {$eq: null}}
        }).then(function (loans) {
            res.render('all_loans', { loans : loans });
        }).catch(function (err) {
            res.sendStatus(500);
        })

    } else {
        Loan.findAll({
            include : [
                {model : Book, required: true},
                {model : Patron, required: true}
            ]
        }).then(function (loans) {
            res.render('all_loans', { loans : loans });
        }).catch(function (err) {
            res.sendStatus(500);
        })
    }
});

router.get('/new', function(req, res) {
    const loanDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(loanDate.getDate() + 7);

    // select books on loan at present, do not display them in the drop-down list
    Loan.findAll({})
        .then(function (loans) {
            return loans.filter(function (loan) {
                return loan.returned_on === null
            })
                .map(function (loan) {
                    return loan.book_id;
                });
        })
        .then(function (loanedBookIds) {
            console.log(loanedBookIds);
            Book.findAll({
                where : {id : {
                    $notIn : loanedBookIds
                }}
            })
                .then(function (books) {
                    //console.log(books);
                    Patron.findAll()
                        .then(function (patrons) {
                            res.render('new_loan', {
                                loan : Loan.build(),
                                books : books,
                                patrons : patrons,
                                loanDate : loanDate,
                                returnDate : returnDate
                            })
                        })
                })
        })
});

router.post('/new', function (req, res, next) {
    console.log('POST');
    console.log(req.body);
    Loan.create(req.body).then(function () {
        res.redirect('/loans')
    })
});

// GET return book
router.get('/return_book/:id', function (req, res, next) {
    Loan.belongsTo(Book, {foreignKey: 'book_id'});
    Loan.belongsTo(Patron, {foreignKey: 'patron_id'});

    Loan.findAll({
            include : [
                {model: Book, required: true},
                {model: Patron, required: true}
            ],
            where : {id : {$eq: req.params.id}}
        })
        .then(function (loan) {
            console.log(loan);
            res.render('return_book', {
                loan : loan,
                returned_on : new Date()
            });
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});


// PUT return book

router.post('/return_book/:id', function (req, res, next) {
    console.log(req.params.id);
    Loan.findById(req.params.id)
        .then(function (loan) {
            console.log('reqbody____________');

            console.log(req.body);
            console.log('loan____________');

            console.log(loan);
            return loan.update(req.body)
        })
        .then(function () {
            res.redirect('/loans');
        })
        .catch(function (err) {
            res.sendStatus(500);
        })
});

module.exports = router;