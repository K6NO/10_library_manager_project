var express = require('express');
var router = express.Router();
const Book = require('../models').books;
const Patron = require('../models').patrons;
const Loan = require('../models').loans;

// GET /patrons
router.get('/', function(req, res, next) {
    let searchField = req.query.searchField;
    let page = req.query.page;
    let prevPage = parseInt(page)-1;


    // display search results
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
        // use pagination to display results in batches of 10
    } else if (page) {
        let offset = parseInt(page) * 10;
        Patron.findAll({
            order : [['last_name', 'ASC' ]],
            limit : 10,
            offset: offset
        })
            .then(function (patrons) {
            res.render('all_patrons', {
                patrons: patrons,
                page: parseInt(page) + 1,
                prevPage: prevPage
            });
        })
            .catch(function (err) {
                response.sendStatus(500);
            })
    }
});

// GET /patrons/new
router.get('/new', function(req, res, next) {
    res.render('new_patron', { patron: Patron.build()});
});

// POST /patrons/new
router.post('/new', function(req, res, next) {
    console.log(req.body);
    Patron.create(req.body)
        .then(function () {
        res.redirect('/patrons?page=0')
    })
        .catch(function (err) {
            if(err.name ==='SequelizeValidationError'){
                console.log(err.name);
                res.render('new_patron', {
                    patron: Patron.build(req.body),
                    errors : err.errors
                })
            } else {
                throw err;
            }
        });
});

//GET /patrons/patron_detail
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

// PUT /patrons/patron_detail
router.put('/patron_detail/:id', function (req, res, next) {
    Patron.findById(req.params.id)
        .then(function (patron) {
            return patron.update(req.body);
        })
        .then(function () {
            res.redirect('/patrons?page=0');
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