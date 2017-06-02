var express = require('express');
var router = express.Router();
const Book = require('../models').books;
const Patron = require('../models').patrons;
const Loan = require('../models').loans;

// GET all patrons
router.get('/', function(req, res, next) {
    var searchField = req.query.searchField;

    if(searchField !== undefined) {
        Patron.findAll({
            where: {
                $or: [
                    {
                        first_name: {
                            $like: '%' + searchField + '%'
                        }
                    },
                    {
                        last_name: {
                            $like: '%' + searchField + '%'
                        }
                    },
                    {
                        address: {
                            $like: '%' + searchField + '%'
                        }
                    },
                    {
                        email: {
                            $like: '%' + searchField + '%'
                        }
                    },
                    {
                        library_id: {
                            $like: '%' + searchField + '%'
                        }
                    },
                    {
                        zip_code: {
                            $like: '%' + searchField + '%'
                        }
                    }
                ]
            }
        })
            .then(function (patrons) {
                res.render('all_patrons', {patrons : patrons})
            })
            .catch(function (err) {
                response.sendStatus(500);
            })
    } else {
        Patron.findAll().then(function (patrons) {
            res.render('all_patrons', {patrons: patrons });
        })
    }

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
                    console.log(patron);

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
    Patron.findById(req.params.id)
        .then(function (patron) {
            return patron.update(req.body);
        })
        .then(function () {
            res.redirect('/patrons');
        })
        .catch(function (err) {
            if(err.name === 'SequelizeValidationError'){
                Loan.belongsTo(Book, {foreignKey: 'book_id'});
                Loan.belongsTo(Patron, {foreignKey: 'patron_id'});

                Loan.findAll({
                    include: [
                        {model: Book,required: true},
                        {model: Patron,required: true}
                    ],
                    where: {
                        patron_id: req.params.id
                    }
                }).then(function(loans) {
                    console.log(err.errors);
                    req.body.id = req.params.id;
                    res.render('patron_detail', {
                        patron: req.body,
                        loans: loans,
                        errors: err.errors
                    });
                }).catch(function(err) {
                    res.sendStatus(500);
                }); // End of Loans.findAll
            } else {
                throw err;
            }
        })

});

module.exports = router;