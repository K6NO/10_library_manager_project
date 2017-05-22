var express = require('express');
var router = express.Router();
var Patron = require('../models').patrons;

// GET all patrons
router.get('/', function(req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render('all_patrons', {patrons: patrons });
    }).catch(function (err) {

        res.send(500);
    })
});

// GET new patron page
router.get('/new', function(req, res, next) {
    res.render('new_patron', { patron: Patron.build()});
});

// POST new patron
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

//GET single patron
router.get('/patron_detail/:id', function (req, res, next) {
    Patron.findById(req.params.id).then(function (patron) {
        if(patron){
            res.render('patron_detail', {
                patron : patron
            })
        } else {
            res.send(404);
        }
    }).catch(function (err) {
        res.send(500);
    })
});

// UPDATE patron
router.post('/patron_detail/:id', function (req, res, next) {
    console.log(req.params.id);
    Patron.findById(req.params.id)
        .then(function (patron) {
            console.log(patron);
            if (patron){
                return patron.update(req.body);
            } else {
                res.send(404);
            }
        })
        .then(function (patron) {
            res.redirect('/patrons/patron_detail/' + patron.id);
        })
        .catch(function (err) {
            if(err.name === 'SequelizeValidationError'){
                var patron = Patron.build(req.body);
                patron.id = req.params.id;
                res.render('/patron_detail/' + patron.id, {
                    patron : patron,
                    errors : err.errors
                })
            } else {
                throw err;
            }
        }).catch(function (err) {
        res.send(500);
    })
});

module.exports = router;