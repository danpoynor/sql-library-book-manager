'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Authors',
      [
        {
          id: 1,
          first_name: 'J.K.',
          last_name: 'Rowling'
        },
        {
          id: 2,
          first_name: 'Stephen',
          last_name: 'King'
        },
        {
          id: 3,
          first_name: 'J.R.R.',
          last_name: 'Tolkien'
        },
        {
          id: 4,
          first_name: 'George',
          last_name: 'RR Martin'
        },
        {
          id: 5,
          first_name: 'J.M.',
          last_name: 'Rowling'
        },
        {
          id: 6,
          first_name: 'Suzanne',
          last_name: 'Collins'
        },
        {
          id: 7,
          first_name: 'Yoko',
          last_name: 'Ogawa'
        },
        {
          id: 8,
          first_name: 'Colson',
          last_name: 'Whitehead'
        },
        {
          id: 9,
          first_name: 'Stephen',
          last_name: 'Hawking'
        },
        {
          id: 10,
          first_name: 'Mary',
          last_name: 'Shelley'
        },
        {
          id: 11,
          first_name: 'Andy',
          last_name: 'Weir'
        },
        {
          id: 12,
          first_name: 'Ernest',
          last_name: 'Hemingway'
        },
        {
          id: 13,
          first_name: 'Jane',
          last_name: 'Austen'
        },
        {
          id: 14,
          first_name: 'Mark',
          last_name: 'Twain'
        },
        {
          id: 15,
          first_name: 'Charles',
          last_name: 'Dickens'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
