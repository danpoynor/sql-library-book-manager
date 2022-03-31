'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Authors',
      [
        {
          id: 1,
          firstName: 'J.K.',
          lastName: 'Rowling',
          date_of_birth: '1965-07-31',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          firstName: 'Stephen',
          lastName: 'King',
          date_of_birth: '1947-09-21',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          firstName: 'J.R.R.',
          lastName: 'Tolkien',
          date_of_birth: '1892-01-03',
          date_of_death: '1973-01-09',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          firstName: 'George',
          lastName: 'RR Martin',
          date_of_birth: '1948-08-20',
          date_of_death: null,

          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          firstName: 'J.M.',
          lastName: 'Rowling',
          date_of_birth: '1965-07-31',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          firstName: 'Suzanne',
          lastName: 'Collins',
          date_of_birth: '1959-08-08',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          firstName: 'Yoko',
          lastName: 'Ogawa',
          date_of_birth: '1962-01-01',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 8,
          firstName: 'Colson',
          lastName: 'Whitehead',
          date_of_birth: '1961-01-01',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 9,
          firstName: 'Stephen',
          lastName: 'Hawking',
          date_of_birth: '1942-08-24',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 10,
          firstName: 'Mary',
          lastName: 'Shelley',
          date_of_birth: '1827-11-09',
          date_of_death: '1891-07-10',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 11,
          firstName: 'Andy',
          lastName: 'Weir',
          date_of_birth: '1953-01-01',
          date_of_death: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 12,
          firstName: 'Ernest',
          lastName: 'Hemingway',
          date_of_birth: '1899-09-21',
          date_of_death: '1961-07-02',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 13,
          firstName: 'Jane',
          lastName: 'Austen',
          date_of_birth: '1775-12-16',
          date_of_death: '1817-07-25',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 14,
          firstName: 'Mark',
          lastName: 'Twain',
          date_of_birth: '1835-01-01',
          date_of_death: '1901-07-09',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 15,
          firstName: 'Charles',
          lastName: 'Dickens',
          date_of_birth: '1812-02-25',
          date_of_death: '1870-01-01',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
