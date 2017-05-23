'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('patrons', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    library_id: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      fullName : function () {
        return this.first_name + ' ' + this.last_name;
      }
    }
  }, {
    underscored: true
  });
  return Patrons;
};