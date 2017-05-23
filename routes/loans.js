var express = require('express');
var router = express.Router();
var Loan = require('../models/index').loans;
var Book = require('../models/index').books;
var Patron = require('../models/index').patrons;

router.get('/', function(req, res) {
    Loan.findAll({
            //include : [
            //    {model : Book},
            //    {model : Patron}
            //]
    }).then(function (loans) {
        console.log(loans);
        res.render('all_loans', { loans : loans });
    }).catch(function (err) {
        res.sendStatus(500);
    })
});

router.get('/new', function(req, res) {
    var booksAndPatrons = [];
    const loanDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(loanDate.getDate() + 7);
    Book.findAll({
        include : {
            model: Loan
        }
    })
        .then(function (books) {
        booksAndPatrons.push(books);
    });
    Patron.findAll()
        .then(function (patrons) {
            booksAndPatrons.push(patrons);
        })
        .then(function () {
            res.render('new_loan', {
                loan : Loan.build(),
                books : booksAndPatrons[0],
                patrons : booksAndPatrons[1],
                loanDate : loanDate,
                returnDate : returnDate
            });
        })
        .catch(function (err) {
            res.send(500);
        })
});

router.post('/new', function (req, res, next) {
    console.log('POST');
    console.log(req.body);
    Loan.create(req.body).then(function (loan) {
        res.redirect('loan_detail', { loan : loan})
    })
});


module.exports = router;