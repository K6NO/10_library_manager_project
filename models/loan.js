'use strict';
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
    }
  }, {
    underscored: true
  });
  return Loans;
};