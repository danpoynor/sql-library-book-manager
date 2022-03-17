'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookGenres extends Model {}
  BookGenres.init(
    {
      book_id: DataTypes.INTEGER,
      genre_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'BookGenres',
      tableName: 'BookGenres',
      underscored: true,
      timestamps: false
    }
  );
  return BookGenres;
};
