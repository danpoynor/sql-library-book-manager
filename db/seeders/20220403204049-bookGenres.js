'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'BookGenres',
      [
        {
          id: 1,
          book_id: 1,
          genre_id: 1
        },
        {
          id: 2,
          book_id: 2,
          genre_id: 2
        },
        {
          id: 3,
          book_id: 3,
          genre_id: 3
        },
        {
          id: 4,
          book_id: 4,
          genre_id: 4
        },
        {
          id: 5,
          book_id: 5,
          genre_id: 5
        },
        {
          id: 6,
          book_id: 6,
          genre_id: 6
        },
        {
          id: 7,
          book_id: 7,
          genre_id: 7
        },
        {
          id: 8,
          book_id: 8,
          genre_id: 8
        },
        {
          id: 9,
          book_id: 9,
          genre_id: 9
        },
        {
          id: 10,
          book_id: 10,
          genre_id: 10
        },
        {
          id: 11,
          book_id: 11,
          genre_id: 10
        },
        {
          id: 12,
          book_id: 12,
          genre_id: 12
        },
        {
          id: 13,
          book_id: 13,
          genre_id: 13
        },
        {
          id: 14,
          book_id: 14,
          genre_id: 14
        },
        {
          id: 15,
          book_id: 15,
          genre_id: 15
        },
        {
          id: 16,
          book_id: 6,
          genre_id: 4
        },
        {
          id: 17,
          book_id: 4,
          genre_id: 5
        },
        {
          id: 18,
          book_id: 4,
          genre_id: 15
        },
        {
          id: 19,
          book_id: 4,
          genre_id: 3
        },
        {
          id: 20,
          book_id: 4,
          genre_id: 2
        },
        {
          id: 21,
          book_id: 4,
          genre_id: 1
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BookGenres', null, {});
  }
};
