'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('loans', {
    id: {
    type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_by: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returned_on: {
      type: DataTypes.DATE,
      allowNull: false
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