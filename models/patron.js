'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('patrons', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter first name!'
        }
      }
    },
    last_name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter last name!'
        }
      }
    },
    address: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter address!'
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter a valid email address!'
        },
        isEmail: {
          msg : 'Enter a valid email address!'
        }
      }
    },
    library_id: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter library id!'
        }
      }
    },
    zip_code: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          msg : 'Enter zip code!'
        }
      }
    }
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
  });
  return Patrons;
};