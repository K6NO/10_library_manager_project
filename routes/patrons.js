var express = require('express');
var router = express.Router();
var title = 'Library Manager';
var Patron = require('../models').patrons;

router.get('/', function(req, res, next) {
    res.render('all_patrons', { title: title });
});

router.get('/new', function(req, res, next) {
    res.render('new_patron', { patron: Patron.build, title: title });
});

router.post('/new', function(req, res, next) {
    Patron.create(req.body).then(function () {
        res.redirect('/', { title: title})
    });
});

module.exports = router;