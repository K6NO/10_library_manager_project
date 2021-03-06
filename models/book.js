'use strict';

module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter the title!'
        }
      }
    },
    author: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter author name!'
        }
      }
    },
    genre: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter genre!'
        }
      }
    },
    first_published: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {

      }
    },
    instanceMethods : {

    }
  });
  return Books;
};