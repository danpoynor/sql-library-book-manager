'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Books',
      [
        {
          id: 1,
          title: 'The Hunger Games',
          year: 2008,
          author_id: 6
        },
        {
          id: 2,
          title: 'Catching Fire',
          year: 2009,
          author_id: 6
        },
        {
          id: 3,
          title: 'Mockingjay',
          year: 2009,
          author_id: 6
        },
        {
          id: 4,
          title: 'The Ballad of Songbirds and Snakes',
          year: 2020,
          author_id: 6
        },
        {
          id: 5,
          title: 'The Memory Police',
          year: 1994,
          author_id: 7
        },
        {
          id: 6,
          title: 'Nickel Boys',
          year: 2019,
          author_id: 8
        },
        {
          id: 7,
          title: 'The Book of Unknown Americans',
          year: 2014,
          author_id: 6
        },
        {
          id: 8,
          title: 'A Brief History of Time',
          year: 1988,
          author_id: 9
        },
        {
          id: 9,
          title: 'The Universe in a Nutshell',
          year: 2001,
          author_id: 9
        },
        {
          id: 10,
          title: 'Frankenstein',
          year: 1818,
          author_id: 10
        },
        {
          id: 11,
          title: 'The Martian',
          year: 2014,
          author_id: 11
        },
        {
          id: 12,
          title: 'Ready Player One',
          year: 2011,
          author_id: 7
        },
        {
          id: 13,
          title: 'Armada',
          year: 2015,
          author_id: 7
        },
        {
          id: 14,
          title: 'Pride and Prejudice',
          year: 1813,
          author_id: 13
        },
        {
          id: 15,
          title: 'Emma',
          year: 1815,
          author_id: 13
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};
