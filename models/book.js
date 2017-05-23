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
        // associations can be defined here
      }
    },
    instanceMethods : {
      firstPublishedAt : function () {
        return dateFormat(this.first_published, 'yyyy');
      }
    }
  }, {
    underscored: true
  });
  return Books;
};