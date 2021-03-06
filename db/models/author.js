'use strict';
const { Model, DataTypes } = require('sequelize');
const { DateTime } = require('luxon');

module.exports = (sequelize) => {
  class Author extends Model {
    dob() {
      if (this.date_of_birth) {
        return DateTime.fromISO(this.date_of_birth).toLocaleString(DateTime.DATE_HUGE);
      } else {
        return null;
      }
    }
    dod() {
      if (this.date_of_death) {
        return DateTime.fromISO(this.date_of_death).toLocaleString(DateTime.DATE_HUGE);
      } else {
        return null;
      }
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
      },
      // Create a VIRTUAL field that will not exist in the database, but appears to.
      // https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#virtual-fields
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          // Using [].join() is suppose to be quicker/more performant than using a template literal
          return [this.first_name, this.last_name].join(' ');
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        }
      },
      date_of_birth: DataTypes.DATEONLY,
      date_of_death: DataTypes.DATEONLY
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
