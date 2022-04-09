'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Authors',
      [
        {
          id: 1,
          first_name: 'J.K.',
          last_name: 'Rowling',
          date_of_birth: '1965-07-31',
          date_of_death: null
        },
        {
          id: 2,
          first_name: 'Stephen',
          last_name: 'King',
          date_of_birth: '1947-09-21',
          date_of_death: null
        },
        {
          id: 3,
          first_name: 'J.R.R.',
          last_name: 'Tolkien',
          date_of_birth: '1892-01-03',
          date_of_death: '1973-01-09'
        },
        {
          id: 4,
          first_name: 'George',
          last_name: 'RR Martin',
          date_of_birth: '1948-08-20',
          date_of_death: null
        },
        {
          id: 5,
          first_name: 'J.M.',
          last_name: 'Rowling',
          date_of_birth: '1965-07-31',
          date_of_death: null
        },
        {
          id: 6,
          first_name: 'Suzanne',
          last_name: 'Collins',
          date_of_birth: '1959-08-08',
          date_of_death: null
        },
        {
          id: 7,
          first_name: 'Yoko',
          last_name: 'Ogawa',
          date_of_birth: '1962-01-01',
          date_of_death: null
        },
        {
          id: 8,
          first_name: 'Colson',
          last_name: 'Whitehead',
          date_of_birth: '1961-01-01',
          date_of_death: null
        },
        {
          id: 9,
          first_name: 'Stephen',
          last_name: 'Hawking',
          date_of_birth: '1942-08-24',
          date_of_death: null
        },
        {
          id: 10,
          first_name: 'Mary',
          last_name: 'Shelley',
          date_of_birth: '1827-11-09',
          date_of_death: '1891-07-10'
        },
        {
          id: 11,
          first_name: 'Andy',
          last_name: 'Weir',
          date_of_birth: '1953-01-01',
          date_of_death: null
        },
        {
          id: 12,
          first_name: 'Ernest',
          last_name: 'Hemingway',
          date_of_birth: '1899-09-21',
          date_of_death: '1961-07-02'
        },
        {
          id: 13,
          first_name: 'Jane',
          last_name: 'Austen',
          date_of_birth: '1775-12-16',
          date_of_death: '1817-07-25'
        },
        {
          id: 14,
          first_name: 'Mark',
          last_name: 'Twain',
          date_of_birth: '1835-01-01',
          date_of_death: '1901-07-09'
        },
        {
          id: 15,
          first_name: 'Charles',
          last_name: 'Dickens',
          date_of_birth: '1812-02-25',
          date_of_death: '1870-01-01'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
