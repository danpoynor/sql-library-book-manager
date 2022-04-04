'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      this.belongsTo(models.Author);
      this.belongsToMany(models.Genre, {
        through: models.BookGenres,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Please provide a value for "Title".'
          },
          notEmpty: {
            msg: 'Please provide a value for "Title".'
          },
          len: {
            args: [1, 255],
            msg: '"Title" must be between 3 and 255 characters.'
          }
        }
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "Author".'
          },
          notEmpty: {
            msg: 'Please provide a value for "Author".'
          }
        }
      },
      // genre_id: {
      //   type: DataTypes.INTEGER
      // TODO: Validate at least one genre checkbox selection was made
      //   validate: {
      //     notNull: {
      //       msg: 'Please select at least one "Genre".'
      //     },
      //     notEmpty: {
      //       msg: 'Please select at least one "Genre".'
      //     }
      //   }
      // },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "Year".'
          },
          notEmpty: {
            msg: 'Please provide a value for "Year".'
          },
          isInt: {
            msg: '"Year" must be a valid integer.'
          },
          min: {
            args: [1000],
            msg: '"Year" must be greater than 1000.'
          },
          max: {
            args: [2022],
            msg: '"Year" must be less than 2022.'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'Books',
      underscored: true,
      timestamps: false
    }
  );
  return Book;
};
