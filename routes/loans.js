var express = require('express');
var router = express.Router();
var Loan = require('../models/index').loans;
var Book = require('../models/index').books;
var Patron = require('../models/index').patrons;
const dateFormat = require('dateformat');


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
    let loanDate = new Date();
    let returnDate = new Date();
    returnDate.setDate(loanDate.getDate() + 7);
            Book.findAll()
                .then(function (books) {
                    Patron.findAll()
                        .then(function (patrons) {
                            res.render('new_loan', {
                                loan : Loan.build(),
                                books : books,
                                patrons : patrons,
                                loanDate : dateFormat(loanDate, 'yyyy-mm-dd'),
                                returnDate : dateFormat(returnDate, 'yyyy-mm-dd')
                            })
                        })
                });
});

router.post('/new', function (req, res, next) {
    Loan.create(req.body)
        .then(function () {
        res.redirect('/loans')
    })
        .catch(function (err) {
            if(err.name === 'SequelizeValidationError') {
                let loanDate = new Date();
                loanDate = dateFormat(loanDate, 'yyyy-mm-dd');
                console.log(loanDate);
                let returnDate = new Date();
                returnDate = dateFormat(returnDate, 'yyyy-mm-dd');
                returnDate.setDate(loanDate.getDate() + 7);
                Book.findAll()
                    .then(function (books) {
                        Patron.findAll()
                            .then(function (patrons) {
                                res.render('new_loan', {
                                    loan : Loan.build(req.body),
                                    books : books,
                                    patrons : patrons,
                                    loanDate : loanDate,
                                    returnDate : returnDate,
                                    errors: err.errors
                                })
                            })
                    });
            } else {
                //TODO check if it works or simply throw error
                res.sendStatus(500);

            }
        })
});

// GET return book
router.get('/return_book/:id', function (req, res, next) {
    Loan.belongsTo(Book, {foreignKey: 'book_id'});
    Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
    let returnDate = new Date();
    returnDate = dateFormat(returnDate, 'yyyy-mm-dd');

    Loan.findAll({
            include : [
                {model: Book, required: true},
                {model: Patron, required: true}
            ],
            where : {id : {$eq: req.params.id}}
        })
        .then(function (loan) {
            res.render('return_book', {
                loan : loan,
                returned_on : returnDate
            });
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});


// PUT return book
router.put('/return_book/:id', function (req, res) {
    Loan.belongsTo(Book, {foreignKey: 'book_id'});
    Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
    let returnDate = new Date();
    returnDate = dateFormat(returnDate, 'yyyy-mm-dd');

    Loan.findById(req.params.id)
        .then(function (loan) {
            return loan.update(req.body)
        })
        .then(function () {
            res.redirect('/loans');
        })
        .catch(function (err) {
            console.log(req.body);
            if(err.name === 'SequelizeValidationError'){
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
                            returned_on : returnDate,
                            errors: err.errors
                        });
                    })

            } else {
                res.sendStatus(500);
            }
        })
});

module.exports = router;