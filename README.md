# SQL Library Book Manager

Demo web application for managing a collection of books including pages to list, add, update, and delete books using JavaScript, Node.js, Express, Pug, SQLite and the SQL ORM Sequelize. App also includes pagination and search with filter features.

---

## Running the App

Assuming you have `node` and `npm` already installed globally on your system - clone this repo, `cd` into the app folder, then install dependencies:

```bash
git clone https://github.com/danpoynor/sql-library-book-manager.git
cd sql-library-book-manager/
npm install
```

On MacOS or Linux, run the app with this command:

```bash
npm run start
```

or, run in dev mode to view `debug()` messages in your console and have `nodemon` restart the app when file updates are saved:

```bash
npm run start:dev
```

Then load <http://localhost:3000/> in your browser to access the app.

---

## Reset Database

After creating, updating, or deleting entries, you can reset the database if needed by running the following command:

```bash
npm run db:reset
```

This will run scripts located in `db/migrations` to recreate `Authors`, `Genres`, and `Books` tables in the database then populate them with the default data from `db/seeders`.

---

## Screenshots

<details>
<summary>Show/hide</summary>

<p align="center">
  <img width="1252" title="SQL Library Book Manager: Home Page" alt="SQL Library Book Manager: Home Page" src="https://user-images.githubusercontent.com/764270/163472474-f7273aaf-8a50-42ef-9343-6424f43b2755.png">
</p>
<p align="center">
  <img width="1250" title="SQL Library Book Manager: New Book Page" alt="SQL Library Book Manager: New Book Page" src="https://user-images.githubusercontent.com/764270/163472598-33724f8b-26c0-453a-997b-658584a81b0f.png">
</p>
<p align="center">
  <img width="1249" title="SQL Library Book Manager: Book Details Page" alt="SQL Library Book Manager: Book Details Page" src="https://user-images.githubusercontent.com/764270/163472612-1d54cd5f-0d41-4aa6-91d6-57ecc0149592.png">
</p>
<p align="center">
  <img width="1249" title="SQL Library Book Manager: Delete Book Page" alt="SQL Library Book Manager: Delete Book Page" src="https://user-images.githubusercontent.com/764270/163472621-428fed23-db4c-4e64-bf5d-5bd22cfe8579.png">
</p>
<p align="center">
  <img width="1249" title="SQL Library Book Manager: Search Results Page" alt="SQL Library Book Manager: Search Results Page" src="https://user-images.githubusercontent.com/764270/163472636-96168c3d-ec4e-48d7-9812-ad408dcd6010.png">
</p>
  
</details>

---

## Tech Stack

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for [Node.js](http://nodejs.org/).
- [node-sqlite3](https://github.com/TryGhost/node-sqlite3) - Asynchronous, non-blocking [SQLite3](https://sqlite.org/) bindings for [Node.js](http://nodejs.org/).
- [Sequelize](https://sequelize.org/master/manual/getting-started.html) - Modern TypeScript and Node.js ORM for Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.
- [Pug](https://pugjs.org/api/getting-started.html) - A high-performance template engine heavily influenced by [Haml](http://haml.info/)
and implemented with JavaScript for [Node.js](http://nodejs.org) and browsers.
- [Luxon](https://moment.github.io/luxon/#/) - Date and time library (alternative to [Moment.js](https://moment.github.io/luxon/#/why?id=place-in-the-moment-project))
- [nodemon](https://www.npmjs.com/package/nodemon) - A tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [http-errors](https://github.com/jshttp/http-errors) - A set of HTTP error classes for Node.js.

---

## Sequelize Features Used Highlights

- [Validations & Constraints](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/) - Used to validate data before saving to the database.
- [Associations](https://sequelize.org/docs/v6/core-concepts/assocs/) - Used to create relationships between models including [advanced-many-to-many](https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/) relationships using a junction table.
- [Eager Loading](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/) - Used to load associated models in a single query (e.g. `Book.getAuthor()` creates SQL [joins](https://en.wikipedia.org/wiki/Join_(SQL)) under the hood).
- [Migrations](https://sequelize.org/docs/v6/other-topics/migrations/) - Used to generate database tables and initialize models instead of [sync()](https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization). More info [1](https://stackoverflow.com/questions/41595755/sequelize-sync-vs-migrations), [2](https://stackoverflow.com/questions/21105748/sequelize-js-how-to-use-migrations-and-sync#answer-29941038)
- [Seed Data](https://sequelize.org/docs/v6/other-topics/migrations/#creating-the-first-seed-data) - Used to populate the database with initial and repopulate default data in the database.
- [.sequelizerc](https://sequelize.org/docs/v6/other-topics/migrations/#the-sequelizerc-file) file - Used to customize the Sequelize configuration by overriding the default path to `migrations`, `models`, `seeders` and `config` folder for better project organization.
- [Sub Queries](https://sequelize.org/docs/v6/other-topics/sub-queries/) - Used to order Authors list by associate Book count.
- [Virtual fields](https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations) - A field that is created with `type: DataTypes.VIRTUAL` that doesn't exist in the database (it's not an actual column), but it can be used as a real column.
- [SQLite Specific Dialect](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#sqlite) - SQLite doesn't require host, username, or password to connect to the database.

The reason search results aren't paginated: Due to an issue in Sequelize preventing `limit` from working when querying models that have `many-to-many` associations ([StackOverflow](https://stackoverflow.com/questions/65803974/)), I created a special `/search` route that doesn't include the `paginator` template .

Instead of using a two-way `belongsToMany` association for `Books` and `Genres`, I might investigate using `hasMany()` with `separate: true` ([StackOverflow](https://stackoverflow.com/questions/53186006/how-can-i-use-limit-in-include-model-using-sequelize)). Or look into using [Knex](http://knexjs.org/) or [TypeORM](https://typeorm.io/) instead of Sequelize.

---

## Database Structure

The SQLite database file `library.db` is [normalized](https://en.wikipedia.org/wiki/Database_normalization) to include four relational tables (models) instead of having just one table that contains all the data.

```js
// Sequelize associations
Author.hasMany(models.Book); 
Book.belongsTo(models.Author);
Book.belongsToMany(models.Genre, { through: models.BookGenres });
Genre.belongsToMany(models.Book, { through: models.BookGenres });
```

Table columns:

- `Books`: Id, Title, Author, Year
- `Authors`: Id, First Name, Last Name, Birthday, Date of Death
- `Genres`: Id, Name, Description
- `BookGenres`: A 'join table' for the two-way many-to-many relationship between books and genres. This table includes foreign keys to the books and genres tables.

Schema screenshot:

<p align="center">
<img width="664" alt="sql-library-express-db-schema-danpoynor" src="https://user-images.githubusercontent.com/764270/163473788-10faca7c-4a78-40dc-bfd6-58050b4b2336.png">
</p>

In the diagram, the `SequelizeMeta` table is automatically created when using [migrations](https://sequelize.org/docs/v6/other-topics/migrations/) so Sequelize can track which migrations have been applied to the database (version control for databases).

---

## Potential TODOs

- Deleting a genre or author currently also deletes any associated books. Might experiment showing a warning about that before deleting anything, or perhaps set the related fields to `null`.
- Consider using 'page' slug in url instead of 'limit' and 'offset' in paginator.
- Do accessibility testing.
- Do performance testing.
- Add unit tests.
- Refactor Search result highlighting in search.js. It's hacky and feels like something that could be done on the Express side.
- Investigate using [transactions](https://sequelize.org/docs/v6/other-topics/transactions/) to make the code more production ready.
- Set default options `underscored: true` and `timestamps: false` globally when declaring the `sequelize` object using `const sequelize = new Sequelize(...);` rather than declaring in each model definition ([more info](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)). Couldn't get this to work right off.
- Figure out how to log search queries to a table in the database to see what folks search for, how many searches are being made, how often, ...
- In case users edit the `limit` and `offset` in the paginator, redirect them to the first/last page if too low/high.
- Check if paginator `limit=0&offset=0` causes and error.
- Check out alternative ORMs such as [KNEX](http://knexjs.org/) and [TypeORM](https://typeorm.io/).
- Clean up and optimize CSS. Perhaps integrate Dart Sass.
- Any other thoughts to improve contact danpoynor@gmail.com
