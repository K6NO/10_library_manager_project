'use strict';
const dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('loans', {
    id: {
    type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    return_by: {
      type: DataTypes.DATE,
      allowNull: true
    },
    returned_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      loanedOn : function() {
        return dateFormat(this.loaned_on, 'yyyy-mm-dd');
      },
      returnBy: function() {
        return dateFormat(this.return_by, 'yyyy-mm-dd');
      },
      returnedOn: function() {
        if(this.returned_on !== null){
          return dateFormat(this.returned_on, 'yyyy-mm-dd');
        }
      }
    }
  });
  return Loans;
};