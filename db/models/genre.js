'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Genre extends Model {
    shortDescription() {
      const shortDesc =
        this.description.length > 64 ? this.description.substring(0, 64) + '...' : this.description;
      return shortDesc;
    }

    static associate(models) {
      Genre.belongsToMany(models.Book, { through: models.BookGenres });
    }
  }
  Genre.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "Name"'
          },
          notEmpty: {
            msg: 'Please provide a value for "Name"'
          },
          len: {
            args: [1, 255],
            msg: '"Name" must be between 2 and 255 characters'
          }
        }
      },
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Genre',
      tableName: 'Genres',
      underscored: true,
      timestamps: false
    }
  );
  return Genre;
};
