const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Genre extends Model {
    shortDescription() {
      const shortDesc =
        this.description.length > 64 ? this.description.substring(0, 64) + '...' : this.description;
      return shortDesc;
    }
  }
  Genre.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: '"Name" is required'
          },
          len: {
            args: [1, 64],
            msg: '"Name" must be between 3 and 64 characters'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
        allowNull: true
      }
    },
    { sequelize, modelName: 'Genre' }
  );

  return Genre;
};
