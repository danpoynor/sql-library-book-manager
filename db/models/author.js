const { Model, DataTypes } = require('sequelize');
const { DateTime } = require('luxon');

module.exports = (sequelize) => {
  class Author extends Model {
    fullName() {
      const name = `${this.firstName} ${this.lastName}`;
      return name;
    }
    dob() {
      if (this.date_of_birth) {
        const dob = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        return dob;
      } else {
        return 'Unknown';
      }
    }
    dod() {
      if (this.date_of_death) {
        const dod = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
        return dod;
      } else {
        return 'Unknown';
      }
    }
  }

  Author.init(
    {
      firstName: {
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
      lastName: {
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
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true
        // validate: {
        //   isDate: {
        //     msg: 'Please provide a valid date for "Date Of Birth"'
        //   }
        // }
      },
      date_of_death: {
        type: DataTypes.DATE,
        allowNull: true
        // validate: {
        //   isDate: {
        //     msg: 'Please provide a valid date for "Date Of Death"'
        //   }
        // }
      }
    },
    { sequelize, modelName: 'Author' }
  );

  Author.associate = (models) => {
    Author.hasMany(models.Book, {
      foreignKey: 'authorId',
      as: 'books'
    });
  };

  //
  // Test Creating an Author Record
  //

  // Author.create({
  //   firstName: 'Tom',
  //   lastName: 'Hanks'
  // })
  //   .then((author) => {
  //     console.log('✅ Author created:', author.toJSON());
  //   })
  //   .catch((err) => {
  //     console.error('❌ Error creating a row in the database: ', err);
  //   });

  return Author;
};
