var express = require('express');
var router = express.Router();
const Book = require('../models').books;
const Patron = require('../models').patrons;
const Loan = require('../models').loans;

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
        res.redirect('/patrons')
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
        });
});

//GET single patron
router.get('/patron_detail/:id', function (req, res, next) {
    Patron.findById(req.params.id).then(function (patron) {

            //Associations
            Loan.belongsTo(Patron, {foreignKey: 'patron_id'});
            Loan.belongsTo(Book, {foreignKey: 'book_id'});

            Loan.findAll({
                include : [
                    {model: Book, required: true},
                    {model: Patron, required: true}
                ],
                where : {patron_id : req.params.id}
            })
                .then(function (loans) {
                    res.render('patron_detail', {
                        patron : patron,
                        loans : loans
                    })
                })
                .catch(function (err) {
                    res.sendStatus(500);
                })
    })
});

// UPDATE patron
router.put('/patron_detail/:id', function (req, res, next) {
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