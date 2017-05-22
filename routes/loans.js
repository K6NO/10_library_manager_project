var express = require('express');
var router = express.Router();
var Loan = require('../models/index').loans;
var Book = require('../models/index').books;
var Patron = require('../models/index').patrons;


router.get('/', function(req, res) {
    Loan.findAll({
            include : [
                {model : db.books},
                {model : db.patrons}
            ]
    }).then(function (loans) {
        res.render('all_loans', { loans : loans });
    }).catch(function (err) {
        res.send(500);
    })
});

router.get('/new', function(req, res) {
    var booksAndPatrons = [];
    Book.findAll()
        .then(function (books) {
        booksAndPatrons.push(books);
    });
    Patron.findAll()
        .then(function (patrons) {
            //console.log(patrons);
            booksAndPatrons.push(patrons);
        })
        .then(function () {
            //console.log('books:_____');
            //console.log(booksAndPatrons[0]);
            //console.log('patrons:_____');
            console.log(booksAndPatrons[1]);
            res.render('new_loan', {
                loan : Loan.build(),
                books : booksAndPatrons[0],
                patrons : booksAndPatrons[1]
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