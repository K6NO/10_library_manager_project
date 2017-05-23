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
    Book.findAll()
        .then(function (books) {
            Patron.findAll()
                .then(function (patrons) {
                    res.render('new_loan', {
                        loan : Loan.build(),
                        books : books,
                        patrons : patrons,
                        loanDate : loanDate,
                        returnDate : returnDate
                    });
                })

    })
        .catch(function (err) {
            res.sendStatus(500);
        })
});

router.post('/new', function (req, res, next) {
    console.log('POST');
    console.log(req.body);
    Loan.create(req.body).then(function () {
        res.redirect('/loans')
    })
});


module.exports = router;