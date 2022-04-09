# SQL Library Book Manager

WIP - Demo web application for managing a collection of books including pages to list, add, update, and delete books using JavaScript, Node.js, Express, Pug, SQLite and the SQL ORM Sequelize

---

## Reset Database

After creating, updating, or deleting entries, you can reset the database if needed by running the following command:

```bash
npm run db:reset
```

This will run scripts located in `db/migrations` to recreate `Authors`, `Genres`, and `Books` tables in the database then populate them with the default data from `db/seeders`.

---

<style>
details { outline: 1px solid #333; padding: 10px }
</style>

## TODO

- [ ] Test error middleware per #7 <https://teamtreehouse.com/projects/sql-library-manager#instructions>
- [x] Make sure the page-not-found.pug template is being used.
- [ ] Validate in Lighthouse
- Set default options `underscored: true` and `timestamps: false` globally when declaring the `sequelize` object using `const sequelize = new Sequelize(...);` rather than declaring in each model definition ([more info](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)). Couldn't get this to work right off.
- Consider using 'page' slug in url instead of 'limit' and 'offset' in paginator.
- Investigate using [transactions](https://sequelize.org/docs/v6/other-topics/transactions/) to make the code more production ready.

---

## Bugs

- If there's a space in the search query nothing is returned.
- Genres of a book are not searched. Issue with two-way many-to-many `where` clause.
- If limit and query are both set to 0 in the url the app crashes with a memory error.

---

## Tech Stack

- [Express](https://expressjs.com/en/starter/generator.html) (Express application generator used to set up initial boilerplate code)
- [@vscode/sqlite3@5.0.7](https://www.sqlite.org/) - the most used database engine in the world
- [Sequelize](https://sequelize.org/master/manual/getting-started.html) - ORM for SQLite
- [Pug](https://pugjs.org/api/getting-started.html) - templating engine for Express
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Luxon](https://moment.github.io/luxon/#/) - Date and time library (alternative to [Moment.js](https://moment.github.io/luxon/#/why?id=place-in-the-moment-project))

Note the Sequelize SQLite3 security warning mentioned at <https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#sqlite>

---

## Sequelize Features Used Highlights

- [Validations & Constraints](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/) - used to validate data before saving to the database.
- [Associations](https://sequelize.org/docs/v6/core-concepts/assocs/) - used to create relationships between models including [advanced-many-to-many](https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/) relationships using a junction table.
- [Migrations](https://sequelize.org/docs/v6/other-topics/migrations/) used to generate database tables and initialize models instead of [sync()](https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization). More info [1](https://stackoverflow.com/questions/41595755/sequelize-sync-vs-migrations), [2](https://stackoverflow.com/questions/21105748/sequelize-js-how-to-use-migrations-and-sync#answer-29941038)
- [Seed Data](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed-data) used to populate the database with initial and repopulate default data in the database.
- [Sub Queries](https://sequelize.org/docs/v6/other-topics/sub-queries/) - used to order Authors list by associate Book count.


```js
Author.hasMany(models.Book); 
Book.belongsTo(models.Author);
Book.belongsToMany(models.Genre, { through: models.BookGenres });
Genre.belongsToMany(models.Book, { through: models.BookGenres });
```

---

## Node development environment setup

```bash
npx express-generator --view=pug --git --css myapp
cd myapp
npm install
npm i sequelize
??? npm i body-parser
npm i sqlite3
```

On MacOS or Linux, run the app with this command:

```bash
DEBUG=myapp:* npm start
```

Then load <http://localhost:3000/> in your browser to access the app.

---

## Developer Notes

<details>
<summary>Show/hide</summary>

What is the best way to interact with a database?

There are two common approaches for interacting with a database:

- Using the databases' native query language (e.g. SQL)
- Using an Object Data Model ("ODM") or an Object Relational Model ("ORM"). An ODM/ORM represents the website's data as JavaScript objects, which are then mapped to the underlying database. Some ORMs are tied to a specific database, while others provide a database-agnostic backend.

The very best performance can be gained by using SQL, or whatever query language is supported by the database. ODM's are often slower because they use translation code to map between objects and the database format, which may not use the most efficient database queries (this is particularly true if the ODM supports different database backends, and must make greater compromises in terms of what database features are supported).

The benefit of using an ORM is that programmers can continue to think in terms of JavaScript objects rather than database semantics — this is particularly true if you need to work with different databases (on either the same or different websites). They also provide an obvious place to perform data validation.

Note: Using ODM/ORMs often results in lower costs for development and maintenance! Unless you're very familiar with the native query language or performance is paramount, you should strongly consider using an ODM.

Source: [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#what_is_the_best_way_to_interact_with_a_database](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#what_is_the_best_way_to_interact_with_a_database)

---

The form attributes define the HTTP `method` used to send the data and the destination of the data on the server (`action`):

- `action`: The resource/URL where data is to be sent for processing when the form is submitted. If this is not set (or set to an empty string), then the form will be submitted back to the current page URL.
- `method`: The HTTP method used to send the data: `POST` or `GET`.
  - The `POST` method should always be used if the data is going to result in a change to the server's database, because this can be made more resistant to cross-site forgery request attacks.
  - The `GET` method should only be used for forms that don't change user data (e.g. a search form). It is recommended for when you want to be able to bookmark or share the URL.

Source: [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#html_forms](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#html_forms)

---

Often form handling code is implemented using a `GET` route for the initial display of the form and a `POST` route to the same path for handling validation and processing of form data.

Express itself doesn't provide any specific support for form handling operations, but it can use middleware to process `POST` and `GET` parameters from the form, and to validate/sanitize their values.

Source: [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#form_handling_process](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#form_handling_process)

---

Before the data from a form is stored it must be validated and sanitized:

- Validation checks that entered values are appropriate for each field (are in the right range, format, etc.) and that values have been supplied for all required fields.
- Sanitization removes/replaces characters in the data that might potentially be used to send malicious content to the server.

Source: [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#validation_and_sanitization](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms#validation_and_sanitization)

---

Using the popular express-validator module to perform both validation and sanitization of our form data.

```cmd
npm install express-validator
```

Note: The [express-validator](https://express-validator.github.io/docs/#basic-guide) guide on Github provides a good overview of the API. We recommend you read that to get an idea of all its capabilities (including using [schema validation](https://express-validator.github.io/docs/schema-validation.html) and [creating custom validators](https://express-validator.github.io/docs/custom-validators-sanitizers.html)). Below we cover just a subset that is useful for the LocalLibrary.

</details>

---

## SQLite Notes

<details>
<summary>Distinctive Features Of SQLite</summary>

REF: [Distinctive Features Of SQLite](https://www.sqlite.org/different.html)

- Serverless: There is no interprocess communication (typically TCP/IP) to send requests to the server and to receive back results. The main advantage is that there is no separate server process to install, setup, configure, initialize, manage, and troubleshoot. This is one reason why SQLite is a "zero-configuration" database engine. Programs that use SQLite require no administrative support for setting up the database engine before they are run. Any program that is able to access the disk is able to use an SQLite database.
- Single Database File: Database files can easily be copied onto a USB memory stick or emailed for sharing. Other SQL database engines tend to store data as a large collection of files. Often these files are in a standard location that only the database engine itself can access. This makes the data more secure, but also makes it harder to access.
- Stable Cross-Platform Database File: All machines use the same file format. Furthermore, the developers have pledged to keep the file format stable and backwards compatible, so newer versions of SQLite can read and write older database files.
Most other SQL database engines require you to dump and restore the database when moving from one platform to another and often when upgrading to a newer version of the software.
- Compact: The whole SQLite library with everything enabled is less than 500KiB in size.
- Manifest typing: Most SQL database engines use static typing. A datatype is associated with each column in a table and only values of that particular datatype are allowed to be stored in that column. SQLite relaxes this restriction by using manifest typing. In manifest typing, the datatype is a property of the value itself, not of the column in which the value is stored. SQLite thus allows the user to store any value of any datatype into any column regardless of the declared type of that column. (There are some exceptions to this rule: An INTEGER PRIMARY KEY column may only store integers. And SQLite attempts to coerce values into the declared datatype of the column when it can.)

As far as we can tell, the SQL language specification allows the use of manifest typing. Nevertheless, most other SQL database engines are statically typed and so some people feel that the use of manifest typing is a bug in SQLite. But the authors of SQLite feel very strongly that this is a feature. The use of manifest typing in SQLite is a deliberate design decision which has proven in practice to make SQLite more reliable and easier to use, especially when used in combination with dynamically typed programming languages such as Tcl and Python.
- Variable-length records: Most other SQL database engines allocated a fixed amount of disk space for each row in most tables. They play special tricks for handling BLOBs and CLOBs which can be of wildly varying length. But for most tables, if you declare a column to be a VARCHAR(100) then the database engine will allocate 100 bytes of disk space regardless of how much information you actually store in that column.

SQLite, in contrast, use only the amount of disk space actually needed to store the information in a row. If you store a single character in a VARCHAR(100) column, then only a single byte of disk space is consumed. (Actually two bytes - there is some overhead at the beginning of each column to record its datatype and length.)

The use of variable-length records by SQLite has a number of advantages. It results in smaller database files, obviously. It also makes the database run faster, since there is less information to move to and from disk. And, the use of variable-length records makes it possible for SQLite to employ manifest typing instead of static typing.
- Readable source code: The source code to SQLite is designed to be readable and accessible to the average programmer. All procedures and data structures and many automatic variables are carefully commented with useful information about what they do. Boilerplate commenting is omitted.
- SQL statements compile into virtual machine code: Every SQL database engine compiles each SQL statement into some kind of internal data structure which is then used to carry out the work of the statement. But in most SQL engines that internal data structure is a complex web of interlinked structures and objects. In SQLite, the compiled form of statements is a short program in a machine-language like representation. Users of the database can view this [virtual machine language](https://www.sqlite.org/opcode.html) by prepending the [EXPLAIN](https://www.sqlite.org/lang_explain.html) keyword to a query.
- Public domain: The source code for SQLite is in the public domain. No claim of copyright is made on any part of the core source code. This means that anybody is able to legally do anything they want with the SQLite source code. SQLite is different in that copyright law simply does not apply.
- SQL language extensions: SQLite provides a number of enhancements to the SQL language not normally found in other database engines. The EXPLAIN keyword and manifest typing have already been mentioned above. SQLite also provides statements such as [REPLACE](https://www.sqlite.org/lang_replace.html) and the [ON CONFLICT](https://www.sqlite.org/lang_conflict.html) clause that allow for added control over the resolution of constraint conflicts. SQLite supports [ATTACH](https://www.sqlite.org/lang_attach.html) and [DETACH](https://www.sqlite.org/lang_detach.html) commands that allow multiple independent databases to be used together in the same query. And SQLite defines APIs which allow the user to add new [SQL functions](https://www.sqlite.org/c3ref/create_function.html) and [collating sequences](https://www.sqlite.org/c3ref/create_collation.html).

</details>

<details>
<summary>SQLite Database Clients</summary>

- [SQLiteStudio](https://sqlitestudio.pl)
- [DB Browser for SQLite (DB4S)](https://sqlitebrowser.org/dl/)

</details>

---

## Sequelize Notes

- [Sequelize ORM](https://sequelize.org/): Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.
- [Sequelize API Reference](https://sequelize.org/master/identifiers)
- [SQLiteQueryInterface](https://sequelize.org/master/class/src/dialects/sqlite/query-interface.js~SQLiteQueryInterface.html)
- [Sequelize-CLI](https://github.com/sequelize/cli): Command line tool for working with SQLite databases.

### Sequelize CLI

When you're building large applications, setting up Sequelize and writing all the model configurations by hand (including importing & exporting files) can get tiresome, and you could make a mistake.

Use 'migrations' to manage your database schema instead of using `sync()`.

The [Sequelize CLI](https://github.com/sequelize/cli) is a tool that initializes all the configuration code, folders and helpers you need for your application. It also sets up and [configures Sequelize](http://docs.sequelizejs.com/manual/migrations.html#the-cli) to generate and export your models.

### Manage Multiple Environments

Set up database configurations for the three main environments you need in an application:

- <strong>Development:</strong> environment for when you're programming your app.
- <strong>Testing:</strong> environment for running automated tests to make sure your code interacts correctly with the database.
- <strong>Production:</strong> environment for the live site using the "real data" your application needs.

The Sequelize CLI helps [handle the database configurations](http://docs.sequelizejs.com/manual/migrations.html#configuration) for each of the three environments.

<details>
<summary>`npx sequelize --help`</summary>

```bash
% npx sequelize --help

Sequelize CLI [Node: 16.13.1, CLI: 6.4.1, ORM: 6.17.0]

sequelize <command>

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file
  sequelize migration:create                  Generates a new migration file
  sequelize model:generate                    Generates a model and its migration
  sequelize model:create                      Generates a model and its migration
  sequelize seed:generate                     Generates a new seed file
  sequelize seed:create                       Generates a new seed file

Options:
  --version  Show version number                                                                                                  [boolean]
  --help     Show help
```

</details>

<details>
<summary>Sequelize Migrations with sequelize-cli</summary>

Use migrations to manipulate the database table definitions. They help define:

- Tables
- Columns
- Relationships

Compared to models: Models are used by Sequelize to generate methods for accessing and updating the database tables - such as creating and deleting rows.

Migrations make working on the database easier at scale, such as if there are multiple developers working on the app. It a way to have version control  for the database structure.

Migrations are sequential and need to be run in order. They dont' make sense if they don't run in order, so they're ordered by filename starting with the date and time.

</details>

<details>
<summary>Query Examples</summary>

### References

- [Querying](https://sequelize.org/master/manual/model-querying-basics.html)
- [Data retrieval / Finders](https://sequelize.org/master/manual/model-querying-finders.html)
- [`findByPk()`](https://sequelize.org/master/class/lib/model.js%7EModel.html#static-method-findByPk)
- [`findAll()`](https://sequelize.org/master/class/lib/model.js%7EModel.html#static-method-findAll)
- [Applying `where` clauses](https://sequelize.org/master/manual/model-querying-basics.html#applying-where-clauses)

```js
// Get count of all books in the database
// https://sequelize.org/v7/manual/getting-started.html#querying
sequelize
  .query('SELECT * FROM Books', { type: Sequelize.QueryTypes.SELECT })
  .then((count) => {
    console.log(`✅ There are ${count.length} books in the database.`);
  })
  .catch((err) => {
    console.error('❌ Unable to query the database:', err);

    // About Errors
    // The error thrown by Sequelize contains an errors property, which is an array with 1 or more ValidationErrorItems, each represents a failed validation. Before displaying the error, we want to check the type of error.
    if (error.name === 'SequelizeValidationError') {
      // If the error is SequelizeValidationError, map over the error item(s) and return an array holding any error messages. In this case, we're outputting them to the console:
      const errors = error.errors.map((err) => err.message);
      console.error('🚫 Validation errors: ', errors);
    } else {
      // In the else block, use a throw statement to rethrow other types of errors caught by catch (for example, general errors, a record is missing, or any other unforeseen errors):
      throw error;
    }
    });
```

</details>

<details>
<summary>Retrieve Records</summary>

REF: [https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/retrieve-records](https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/retrieve-records)

### `findByPk()`

The method `findByPk()` (or 'find by primary key') retrieves a single instance by its primary key (or id) value.

1. In `app.js`, initialize a new variable named `movieById` to `await Movie.findByPk()`:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... all model instances

    const movieById = await Movie.findByPk();
    console.log(movieById.toJSON());

  } catch(error) {
    ...
  }
})();
```

2. Retrieve a movie by passing `findByPk()` a known ID:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const movieById = await Movie.findByPk(1);
    console.log(movieById.toJSON());

  } catch(error) {
    ...
  }
})();
```

Finder methods like findByPk() return a model instance. In this case, `movieById` is an instance of `Movie`, which contains the data of the table entry with ID `1`. If you convert the instance to JSON, with `movieById.toJSON()`, and log it to the console, you should see a similar output:

```json
{ id: 1,
  title: 'Toy Story',
  runtime: 81,
  releaseDate: '1995-11-22',
  isAvailableOnVHS: true,
  createdAt: 2019-07-19T14:37:34.682Z,
  updatedAt: 2019-07-19T14:37:34.682Z }
```

If you pass `findByPk()` an ID that does not exist in a table, the method returns `null`.

*Suggestion: Comment out or remove all console.log() methods in your try block, except for the one you're currently testing.*

### `findOne()`

The method `findOne()` finds and retrieves one specific element in a table. For example, find one movie with a runtime of 115 minutes.

1. Initialize a variable named `movieByRuntime` to `await Movie.findOne()`:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const movieByRuntime = await Movie.findOne();

  } catch(error) {
    ...
  }
})();
```

`findOne` takes an options object where you specify the attributes to search. Let's instruct Sequelize that we want to "find a movie where runtime is 115".

2. Pass `Movie.findOne()` an object. Inside the object, add the `where` property. Set `where` to an object containing the key/value `runtime: 115`:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const movieByRuntime = await Movie.findOne({ where: { runtime: 115 } });
    console.log(movieByRuntime.toJSON());

  } catch(error) {
    ...
  }
})();
```

`.findOne()` returns the first matching record. In this case, the first entry of the 'Movies' table with `runtime` set to `115`. The console output should display one entry of a movie with a runtime of 115:

```json
{ id: 2,
  title: 'The Incredibles',
  runtime: 115,
  releaseDate: '2004-04-14',
  isAvailableOnVHS: true,
  createdAt: 2019-07-19T15:36:05.066Z,
  updatedAt: 2019-07-19T15:36:05.066Z }
```

### What is `where`?

The `where` object is used to filter a query using the property / value pairs passed to it. As you'll soon learn, the property values can be primitives for equality matches or objects for creating more complex comparisons, using [Sequelize's operators](https://sequelize.org/master/manual/model-querying-basics.html#operators).

`findOne()` vs. `findByPk()`

Since `findOne()` always returns only the first matching record, there may be times when the method returns the wrong record (or not the one you want). For example, if you're doing a query for 'Tom Hanks' using just `lastName`:

```js
const personByLastname = await Person.findOne({ where: { lastName: 'Hanks' } });
```

...there may be tens (or hundreds) of records where `lastName` is `Hanks`. So it's likely that the method above could return unexpected results.

Because of this, searching by ID with `findByPk()` is a more efficient and precise way to find a record:

```js
const personById = await Person.findByPk(100);
```

### `findAll()`

The `findAll` method retrieves a collection of *all* records, instead of a single record.

1. *Retrieve all movies*. Initialize a variable named `movies` to `await Movie.findAll()`:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const movies = await Movie.findAll();
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

`movies` now holds an array with all instances of `Movie` -- in other words, all entries in the `Movies` table.

2. <strong>Log the results</strong>. Map over each instance in the array and convert it JSON:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const movies = await Movie.findAll();
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

The console output should display all movie records.

### Filter Results

The `findAll()` method also take an options object. Within the object you can add any number of criteria to filter the results. For example, the following query uses the `where` object to find all people with the last name 'Hanks':

```js
const people = await Person.findAll({
  where: {
    lastName: 'Hanks'
  }
});
// SELECT * FROM People WHERE lastName = 'Hanks';
console.log( people.map(person => person.toJSON()) );
```

You can also use `where` for more complex AND conditions by nesting two or more properties. For example, the following returns all movies where `runtime` is `92` *and* `isAvailableOnVHS` is `true`:

```js
const movies = await Movie.findAll({
  where: {
    runtime: 92,
    isAvailableOnVHS: true
  }
});
// SELECT * FROM Movies WHERE runtime = 92 AND isAvailableOnVHS = true;
console.log( movies.map(movie => movie.toJSON()) );
```

</details>

<details>
<summary>Attributes, Operators and Ordering</summary>

REF: [https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/attributes-operators-and-ordering](https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/attributes-operators-and-ordering)

Currently, when you retrieve data using a retrieval method, all attributes (or columns) of an entry are returned. For instance:

```json
{ id: 2,
  title: 'The Incredibles',
  runtime: 115,
  releaseDate: '2004-04-14',
  isAvailableOnVHS: true,
  createdAt: 2019-07-19T15:36:05.066Z,
  updatedAt: 2019-07-19T15:36:05.066Z }
```

Sequelize lets you pass an attributes option to a finder method to specify exactly which attributes to return.

### Return a Subset of Data with Attributes

Let's return only IDs and titles from the 'Movies' table.

1. Add an `attributes` property to the `findAll()` method's options object. To select the `id` and `title` attributes, set the value of `attributes` to an array, then specify the attributes by including the strings `'id'` and `'title'` inside the array:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {

    // ... All model instances

    const movies = await Movie.findAll({
      attributes: ['id', 'title'], // return only id and title
      where: {
        isAvailableOnVHS: true,
      },
    });
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

2. Run your app with `npm start`. `findAll()` returns only the `id` and `title` of each movie. The JSON data in your console output might look similar to this:

```js
[ { id: 1, title: 'Toy Story' },
  { id: 2, title: 'The Incredibles' },
  { id: 3, title: 'Toy Story 2' } ]
```

### Operators

You'll often want to create more complex comparisons and filtering of data. For example, return all movies released after `1-01-2004`, or movies with a runtime greater than 95 minutes.

Sequelizes provides special properties called operators to let you do just that. You can specify comparisons like "greater than", "less than", "endsWith" and [much more](https://sequelize.org/master/manual/model-querying-basics.html#operators) within your `where` clauses.

The `db/index.js` file exposes the Sequelize package whenever you import `./db` into your application code. This means that wherever you use `require('./db')`, you have access to all of Sequelize's methods and functionality. Let's begin using operators by first destructuring the `Op` (Operators) property from Sequelize.

1. In `app.js`, use destructuring assignment to extract the property `Op` from `db.Sequelize`:

```js
const db = require('./db');
const { Movie, Person } = db.models;
const { Op } = db.Sequelize;
...
```

You use an operator by calling the operator property (`Op`) followed by the operator you want to use inside brackets.

2. Return all movies with a release data "greater than or equal" to `'2004-01-01'`, using `[Op.gte]: '2004-01-01'`, as shown below:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {

    // ... All model instances

    const movies = await Movie.findAll({
      attributes: ['id', 'title'],
      where: {
        releaseDate: {
          [Op.gte]: '2004-01-01' // greater than or equal to the date
        }
      },
    });
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

3. Add the `runtime` property to return movies with a runtime "greater than" 95 minutes AND a release date "greater than or equal" to `'2004-01-01'` (feel free to use other properties):

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {

    // ... All model instances

    const movies = await Movie.findAll({
      attributes: ['id', 'title'],
      where: {
        releaseDate: {
          [Op.gte]: '2004-01-01', // greater than or equal to the date
        }
        runtime: {
          [Op.gt]: 95, // greater than 95
        },
      },
    });
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

Operators are a useful and powerful feature, and there's a whole lot more you can do with them, like check if a string value "startsWith" or "endWith" a certain word:

```js
title: {
  [Op.endsWith]: 'story'
}
```

Or, check if a number value falls "between" a specified range:

```js
runtime: {
  [Op.between]: [75, 115]
}
```

Be sure to experiment with some of the other operators displayed in the [Sequelize docs.](https://sequelize.org/master/manual/model-querying-basics.html#operators)

### Ordering

Within the `findAll()` method's options object, you can also specify the order of the returned results. For example, let's return all movies with a title that ends with 'story'. We'll return the results according to their ID in descending order.

Order a set of results using the `order` property with an array of arrays:

```js
const movies = await Movie.findAll({
  attributes: ['id', 'title'],
  where: {
    title: {
      [Op.endsWith]: 'story'
    },        
  },
  order: [['id', 'DESC']] // IDs in descending order
});
console.log( movies.map(movie => movie.toJSON()) );
```

The `order` value is an array of arrays because you could order by multiple attributes (columns). Each array includes the attribute you want to order by and in which order, ASCending or DESCending. In this case we're ordering by IDs in DESCending order.

The results might look similar to what's shown below:

```js
[ { id: 6, title: 'West Side Story' },
  { id: 5, title: 'The Neverending Story' },
  { id: 1, title: 'Toy Story' } ]
```

The following returns all movies released on or after `01-01-1995`. It's ordering by `releaseDate` in ASCending order:

```js
const movies = await Movie.findAll({
  attributes: ['id', 'title', 'releaseDate'],
  where: {
    releaseDate: {
      [Op.gte]: '1995-01-01'
    }
  },
  order: [['releaseDate', 'ASC']], // dates in ascending order
});
console.log( movies.map(movie => movie.toJSON()) );
```

The results might look similar to what's shown below (notice the dates are in order from earliest to latest release):

```js
[ { id: 1, title: 'Toy Story', releaseDate: '1995-11-22' },
  { id: 4, title: 'Toy Story 2', releaseDate: '1999-11-24' },
  { id: 2, title: 'The Incredibles', releaseDate: '2004-04-14' },
  { id: 3, title: 'Toy Story 3', releaseDate: '2010-06-18' } ]
```

Ordering can be useful when you, for example, need to order a list of entries (such as blog articles) by the `createdAt` attribute. You're able to list the articles from most recent to oldest.

Example:

```js
const articles = await Article.findAll({
  attributes: ['title', 'author'],
  order: ["createdAt", "DESC"]], // articles in descending order
});
```

Resources

- [Attributes](https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries)
- [Operators](https://sequelize.org/master/manual/model-querying-basics.html#operators)
- [Ordering](https://sequelize.org/master/manual/model-querying-basics.html#ordering)

</details>

<details>
<summary>Update a Record</summary>

REF: [https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/update-a-record](https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/update-a-record)

You're halfway done with learning CRUD operations. You've created and read rows of data. In this step, you will work on updating records.

A movie in the database just released a VHS collector's edition and you need to update its `isAvailableOnVHS` value from `false` to `true`. Before updating a record, you first need to find it, which you already know how to do.

### Use `findByPk()` to Find the Record to Update

For example, the following returns 'Toy Story 3':

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const toyStory3 = await Movie.findByPk(3);

  } catch(error) {
    ...
  }
})();
```

Once you've found the record, there are two ways you might update it:

- Update the property using dot notation (`instance.property = new value`) and persist the changes with `save()`.
- Use the Sequelize `update()` method.

### Update a Record with `save()`

The following updates the `isAvailableOnVHS` value of the `toyStory3` instance using dot notation:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const toyStory3 = await Movie.findByPk(3);
    toyStory3.isAvailableOnVHS = true;
    await toyStory3.save();

    console.log( toyStory3.get({ plain: true }) );

  } catch(error) {
    ...
  }
})();
```

The `save()` method needs to be called on the model instance to save the update to the database.

Note: When converting an instance or collection of instances to JSON, calling `get({ plain: true})` returns the same as calling `.toJSON()` – a *plain* object with just the model attributes and values.

### Update a Record with `update()`

The following calls the model instance `update()` method, which accepts an object with the key/values to update:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const toyStory3 = await Movie.findByPk(3);
    await toyStory3.update({
      isAvailableOnVHS: true,
    });
    console.log( toyStory3.get({ plain: true }) );

  } catch(error) {
    ...
  }
})();
```

Both approaches you learned effectively update a record and persist the changes to the database. Once you update a record, its `updatedAt` value automatically updates to the time at which the update occurred:

```js
{ id: 3,
  title: 'Toy Story 3',
  runtime: 103,
  releaseDate: '2010-06-18',
  isAvailableOnVHS: true,
  createdAt: 2019-07-22T19:38:28.990Z,
  updatedAt: 2019-07-22T19:38:29.023Z }
```

### Define Which Attributes to Save

Sequelize gives you the ability to specify exactly which attributes should be saved when using either the `save()` or `update()` method, with the `fields` property.

1. <strong>Pass `update()` an *options* object as a second argument.</strong> Then, try to update the `title` value of a movie as shown below:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const toyStory3 = await Movie.findByPk(3);
    await toyStory3.update({
      title: 'Trinket Tale 3', // new title
      isAvailableOnVHS: true,
    }, { }); 

    console.log( toyStory3.get({ plain: true }) );

  } catch(error) {
    ...
  }
})();
```

The `fields` property sets which attributes are allowed to be updated and saved to the database, using an array of attribute (or column) names.

2. Add the `fields` property to the options object, and set it to an array holding the string `'isAvailableOnVHS'`:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // ... All model instances

    const toyStory3 = await Movie.findByPk(3);
    await toyStory3.update({
      title: 'Trinket Tale 3', // this will be ignored
      isAvailableOnVHS: true,
    }, { fields: ['isAvailableOnVHS'] }); 

    console.log( toyStory3.get({ plain: true }) );

  } catch(error) {
    ...
  }
})();
```

When you run the app, the console output and your 'Movies' table should not display an updated movie title -- only `isAvailableOnVHS` should be updated to `true`:

```js
{ id: 3,
  title: 'Toy Story 3',
  runtime: 103,
  releaseDate: '2010-06-18',
  isAvailableOnVHS: true,
  createdAt: 2019-07-22T21:09:07.085Z,
  updatedAt: 2019-07-22T21:09:07.115Z }
```

If you, however, specify the `title` attribute in the `fields` array:

```js
await toyStory3.update({
  title: 'Trinket Tale 3',
  isAvailableOnVHS: true,
}, { fields: ['title', 'isAvailableOnVHS'] }); 
```

... the `title` attribute will be updated and saved to the database:

```js
{ id: 3,
  title: 'Trinket Tale 3',
  runtime: 103,
  releaseDate: '2010-06-18',
  isAvailableOnVHS: true,
  ... }
```

Being able to allow/disallow (or *whitelist*) columns to update is useful when you want to ensure that users cannot pass objects with columns that should not be updated via a form, for example).

### Resources

- [Updating / Saving / Persisting an instance](https://sequelize.org/master/manual/instances.html#updating---saving---persisting-an-instance)
- [`update()`](https://sequelize.org/master/class/lib/model.js%7EModel.html#static-method-update)

</details>

<details>
<summary>Delete a Record</summary>

REF: [https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/delete-a-record](https://teamtreehouse.com/library/using-sql-orms-with-nodejs/performing-crud-operations/delete-a-record)

In this step, you will learn how to delete records with Sequelize. Once you've created an instance and have a reference to it, you can delete a record from your database using the Sequelize `destroy()` method.

### Delete a Movie

You first need to find a record in order to delete it.

In `app.js`, use `findByPk()` to retrieve the movie instance you want to delete:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // All model instances... 

    // Find a record
    const toyStory = await Movie.findByPk(1);

    // Find and log all movies
    const movies = await Movie.findAll();
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

Once you retrieve the movie, you can destroy it. Like `create()`, `update()`, and all finder methods, the `destroy()` method is an asynchronous call that returns a Promise.

Call the `destroy()` method on the model instance to delete the record:

```js
(async () => {
  await db.sequelize.sync({ force: true });

  try {
    // All model instances... 

    // Find a record
    const toyStory = await Movie.findByPk(1);

    // Delete a record
    await toyStory.destroy();

    // Find and log all movies
    const movies = await Movie.findAll();
    console.log( movies.map(movie => movie.toJSON()) );

  } catch(error) {
    ...
  }
})();
```

Note: Since `delete` is a reserved keyword in JavaScript, Sequelize uses `destroy()`.

3. Run your app with `npm start`. The deleted record should not return from the `Movie.findAll()` query and appear in the console output. If you refresh your 'Movie' database table, the destroyed entry should disappear.

### Logical / "Soft" Deletes vs. Physical Deletes

Sequelize provides a "paranoid" setting for "soft" deletes. This gives you the ability to mark a record as deleted instead of physically removing it from the database.

1. <strong>Open the file `db/models/movie.js`</strong>. Pass the `paranoid` property to your `Movie` model's options object and set it to `true`:

```js
module.exports = (sequelize) => {
  class Movie extends Sequelize.Model {}
  Movie.init({
    id: {...},
    title: {...},
    runtime: {...},
    releaseDate: {...},
    isAvailableOnVHS: {...},
  }, { 
    paranoid: true, // enable "soft" deletes
    sequelize 
  });

  return Movie;
};
```

Setting the `paranoid` option to `true` means that a destroyed record will not be physically deleted from the database, but it will also not be returned in future queries.

2. <strong>Run your app with `npm start`<strong>. When you refresh the 'Movies' table in DB Browser for SQLite, the destroyed record should reappear. Notice how Sequelize added a `deletedAt` column to the table indicating the time at which the record's 'soft deletion' happened. The other record's `deletedAt` value is `NULL`.

When running queries, Sequelize will automatically filter out records whose `deletedAt` column values are not `null`. Those records will no longer be included in future queries.

Not permanently deleting a record with `destroy()` could have its advantages. It allows you to keep a history for database auditing. It also makes it easier to restore "deleted" data, and there is less risk of data loss if something goes wrong.

However, soft-deleted records also take up space in your database. They could add complexity to your queries and you may have to consider the performance implications of keeping all the data down the road.

### Working in Bulk

Now that you've learned about CRUD operations with Sequelize, [check out the docs](https://sequelize.org/master/manual/instances.html#working-in-bulk--creating--updating-and-destroying-multiple-rows-at-once-) to view the methods for creating, updating, and deleting <strong>multiple</strong> instances (or rows) at once.

- [Destroying / Deleting persistent instances](https://sequelize.org/master/manual/instances.html#destroying---deleting-persistent-instances)
- [`destroy()`](https://sequelize.org/master/class/lib/model.js%7EModel.html#static-method-destroy)
- [Physical vs. logical / soft delete](https://stackoverflow.com/questions/378331/physical-vs-logical-soft-delete-of-database-record)
- [`bulkCreate()`](https://sequelize.org/master/class/lib/model.js%7EModel.html#static-method-bulkCreate)

</details>

<details>
<summary>Associations (Data Relationships)</summary>

### Associations (Data Relationships)

The data in your models can be described using the nouns that you've identified for your application - in this case, `Movie` and `Person`.

There are also relationships between your models (or tables). For example, a Movie might be associated with a Person as a director, and might also be associated with one or more "People" (the plural of Person) as its actors. These associations between Movie and Person are known as "data relationships"

- REF: <https://teamtreehouse.com/library/data-relationships-with-sql-and-sequelize-2>
- [Sequelize DoAssociations Docs](https://sequelize.org/master/manual/assocs.html)

</details>

<details>
<summary>Delete a Record</summary>

</details>

<details>
<summary>Express Routes and CRUD Operations</summary>

### Express Routes and CRUD Operations

You'll often wire [Express routes](https://expressjs.com/en/guide/routing.html) to your SQL-based database via Sequelize ORM. The following demonstrates how you might use Sequelize within an Express application to perform CRUD operations:

```js
const { Router } = require('express');
const { Movie } = require('../models');

const router = new Router();

/* POST create movie */
router.post('/', async (req, res, next) => {
  const movie = await Movie.create(req.body);
  res.redirect('/movies/' + movie.id);
});

/* GET / retrieve movie to update */
router.get('/:id/edit', async (req, res, next) => {
  const movie = await Movie.findByPk(req.params.id);
  res.render('movies/edit', { movie, title: 'Edit Movie' });
});

/* PUT update movie */
router.put('/:id', async (req, res, next) => {
  const movie = await Movie.findByPk(req.params.id);
  await movie.update(req.body);
  res.redirect('/movies/' + movie.id);
});

/* Delete movie */
router.post('/movies/:id/delete', async (req, res) => {
  const movieToDelete = await Movie.findByPk(req.params.id);
  await movieToDelete.destroy();
  res.redirect('/movies');
});
```

</details>
