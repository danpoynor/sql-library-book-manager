'use strict';
const { Model, DataTypes } = require('sequelize');

// Model Level Options
// To further configure a model using options, pass option properties
// to the model instance's "options" object - the second argument of
// `model.init()`
// You can do things like:
// - disable timestamps using `timestamps: false`
// - use `freezeTableName` to prevent plural table names
// - use lowercase model names with `modelName` property
// - define your own custom table names using `tableName`
// - set global options using `define`, such as:
// define: {
//   freezeTableName: true,
//   timestamps: false,
// },
// More info: https://sequelize.org/master/manual/model-basics.html#column-options

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author);
      // Book.belongsToMany(models.Genre, {
      //   through: models.BookGenres,
      //   foreignKey: 'book_id',
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE'
      // });
      Book.belongsToMany(models.Genre, { through: 'BookGenres', timestamps: false });
    }
  }

  // Book.init() defines a new table in the database with the name 'Books'.
  // Sequelize will look for information in the 'Books' table.
  // An important distinction is that the model name is singular and the
  // table name is plural. Sequelize uses a library called 'inflection'
  // under the hood to automatically pluralize the table name
  // (for example, from Movie to Movies, or from Person to People).
  Book.init(
    {
      // Sequelize adds an id attribute to your model, which generates
      // an 'id' column in your table that assigns each row a unique ID.
      // The ID acts as a 'primary key', or a unique indexable reference
      // for each entry.
      // Instead of the default generated `id` column, you can set a custom
      // column name for primary keys in your table, using `primaryKey: true`.
      // Set custom primary key column
      // id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      // },
      // Specifying `primaryKey: true` instructs Sequelize to generate the
      // primary key column using the property name defined in the model
      // (in this case it's `id`, but it could be anything, like `identifier`).
      // The ID should be a number, so its data type is `INTEGER`, and
      // `autoIncrement: true` automatically generates an ID that increments
      // by 1 for each new entry.
      //
      // Instead of auto incrementing a Primary Key, another option is to
      // use a Universally Unique Identifier ( UUID ). Such as if you were
      // working with multiple databases or had more complex associations
      // between databases, you might consider using a Globally Unique
      // Identifier (GUID) or more commonly referred to in Sequelize as a
      // Universally Unique Identifier (UUID). This is a property you can
      // access and use via Sequelize Data Types to create more
      // unique identifiers.
      // The benefit of doing this is that you can save time in avoiding or
      // even preventing some common pitfalls that can occur when working
      // with multiple databases.
      // https://sequelize.org/v3/api/datatypes/
      // https://blog.programster.org/advantages-of-using-uuids
      // Keep in mind that a UUID may not always be necessary as it's not
      // the most performant approach, so don't feel that you need to use a
      // UUID in every situation. Think of this as another tool in your
      // developer toolkit to use as needed.
      title: {
        // The default length of Sequelize.STRING is 255 (or varchar(255)),
        // but you can specify a different length after the type.
        // For example, Sequelize.STRING(500)
        type: DataTypes.STRING,
        // By default, `null` is an allowed value for every column of a model.
        // This can be disabled setting the `allowNull: false` option for a column.
        allowNull: false,
        // Make sure the title entered is not a duplicate
        // Note this only takes effect after the model is synched to the database.
        // Then the `UNIQUE` constraint will be added in the table as ``title` TEXT UNIQUE`
        // https://sequelize.org/master/manual/validations-and-constraints.html#unique-constraint
        unique: true,
        // Validations are automatically run on `create`, `update` and `save`
        // https://sequelize.org/master/manual/validations-and-constraints.html#validators
        // based on https://github.com/validatorjs/validator.js
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
      // Set the sequelize property to the variable sequelize.
      // Same as { sequelize: sequelize }
      sequelize,
      // Explicitly setting modelName and tableName can be useful when there
      // are multiple models/tables with relationships.
      modelName: 'Book',
      tableName: 'Books',
      underscored: true,
      timestamps: false
    }
  );

  //
  // Test Creating a Book Record
  //

  // An instance of the Book class represents a database row.
  // create() requires an object with properties that map to
  // the model attributes.
  // As you already know, a model is an ES6 class. An instance of the class
  // represents one object from that model (which maps to one row of the
  // table in the database)
  // create() is convenient when you just need to create and save a new
  // record at once (within an Express POST route handler, for example).
  // https://sequelize.org/master/manual/instances.html#creating-persistent-instances
  // Alternative is to use the `Model.build()` method to create a new
  // instance of the model with `defaultValue`s, and then call Model.save()
  // to save the instance to the database.
  // `build()` is useful when you need to manipulate instances in any way before
  // storing them. `build()` would also be useful when you need a model instance to
  // bind to a template (for example, a "New Record" form or page). You can
  // create then save a database object from the data bound to the template.
  // The 'create' method combines the 'build' and 'save' methods.
  // https://sequelize.org/master/manual/instances.html#building-a-non-persistent-instance
  // Book.create({
  //   title: 'DAN TEST 4',
  //   author_id: 'DAN TEST 4',
  //   // genre: 'Fiction',
  //   year: 9999
  // })
  //   .then((book) => {
  //     // If you log just the instance, you will notice that there is a lot
  //     // of additional output. In order to hide and reduce the output to
  //     // just the JSON data, use `toJSON()`.
  //     // Using `toJSON()` automatically guarantees the instances to be
  //     // `JSON.stringify`-ed well.
  //     debug('✅ Book created:', book.toJSON());
  //   })
  //   .catch((err) => {
  //     debug('❌ Error creating a row in the database: ', err);
  //   });

  return Book;
};
