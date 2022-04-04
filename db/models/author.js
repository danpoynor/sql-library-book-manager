'use strict';
const { Model, DataTypes } = require('sequelize');
const { DateTime } = require('luxon');
// const { Book } = require('../models');
const Book = require('./book');

module.exports = (sequelize) => {
  class Author extends Model {
    fullName() {
      const name = `${this.first_name} ${this.last_name}`;
      return name;
    }

    static associate(models) {
      Author.hasMany(models.Book);
    }
  }
  Author.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "First Name"'
          },
          notEmpty: {
            msg: 'Please provide a value for "First Name"'
          },
          len: {
            args: [1, 255],
            msg: '"First Name" must be between 2 and 255 characters'
          }
        }
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "Last Name"'
          },
          notEmpty: {
            msg: 'Please provide a value for "Last Name"'
          },
          len: {
            args: [1, 255],
            msg: '"Last Name" must be between 2 and 255 characters'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Author',
      tableName: 'Authors',
      underscored: true,
      timestamps: false
    }
  );
  return Author;
};
