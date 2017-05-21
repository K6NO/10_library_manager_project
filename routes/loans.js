var express = require('express');
var router = express.Router();
var title = 'Library Manager';
var Loan = require('../models/index').loans;


router.get('/', function(req, res, next) {
    Loan.findAll().then(function (loans) {
        res.render('all_loans', { loans : loans, title: title });
    }).catch(function (err) {
        res.send(500);
    })
});

router.get('/new', function(req, res, next) {
    res.render('new_loan', { loan : Loan.build, title: title });
});

router.post('/new', function (req, res, next) {
    console.log('POST');
    console.log(req.body);
    Loan.create(req.body).then(function (loan) {
        res.redirect('loan_detail', { loan : loan, title: title})
    })
});


module.exports = router;