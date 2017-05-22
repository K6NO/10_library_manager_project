var express = require('express');
var router = express.Router();
var Patron = require('../models').patrons;

router.get('/', function(req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render('all_patrons', {patrons: patrons });
    }).catch(function (err) {

        res.send(500);
    })
});

router.get('/new', function(req, res, next) {
    res.render('new_patron', { patron: Patron.build()});
});

router.post('/new', function(req, res, next) {
    console.log(req.body);
    Patron.create(req.body)
        .then(function (patron) {
        res.render('patron_detail', {patron: patron })
    })
        .catch(function (err) {
            if(err.name ==='SequelizeValidationError'){
                res.render('new_patron', {
                    patron: Patron.build(req.body),
                    errors : err.errors
                })
            } else {
                throw err;
            }
        })
        .catch(function (err) {
            res.send(500);
        });
});

module.exports = router;