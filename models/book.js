'use strict';

const dateFormat = require('dateformat');
module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {

      }
    },
    instanceMethods : {
      firstPublished : function () {
        return dateFormat(this.first_published, 'yyyy');
      }
    }
  });
  return Books;
};