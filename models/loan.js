'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id: {
    type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Loans;
};