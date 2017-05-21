'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models

db.books = require('./book.js')(sequelize, Sequelize);
db.patrons = require('./patron.js')(sequelize, Sequelize);
db.loans = require('./loan.js')(sequelize, Sequelize);

// Associations

db.loans.belongsTo(db.books);
db.loans.belongsTo(db.patrons);

module.exports = db;
