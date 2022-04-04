'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Genres',
      [
        {
          id: 1,
          name: 'Documentary',
          description: ''
        },
        {
          id: 2,
          name: 'Drama',
          description: ''
        },
        {
          id: 3,
          name: 'Comedy',
          description:
            'Usually a fiction full of fun, fancy, and excitement, meant to entertain and sometimes cause intended laughter or amusement; but can be contained in all genres.'
        },
        {
          id: 4,
          name: 'Action',
          description: ''
        },
        {
          id: 5,
          name: 'Horror',
          description:
            'Fiction in which plot and characters are tools used to elicit a feeling of dread and terror, as well as events that often evoke fear in both the characters and the reader. Horrors generally focus on themes of death, demons, evil spirits, and the afterlife.'
        },
        {
          id: 6,
          name: 'Romance',
          description:
            'Those which give primary focus around a love story between two people, usually having an "emotionally satisfying and optimistic ending.'
        },
        {
          id: 7,
          name: 'Thriller',
          description: ''
        },
        {
          id: 8,
          name: 'Sci-Fi',
          description:
            'Speculative fiction with imagined elements that are inspired by natural sciences (physics, chemistry, astronomy, etc.) or social sciences (psychology, anthropology, sociology, etc.). Common elements of this genre include time travel, space exploration, and futuristic societies. Sometimes inspired by mythology and folklore, often including elements of magic.'
        },
        {
          id: 9,
          name: 'Fantasy',
          description:
            'Speculative fiction that use imaginary characters set in fictional universes inspired by mythology and folklore, often including magical elements, magical creatures, or the supernatural. Examples: Alice&rsquo;s Adventures in Wonderland (1885) and the Harry Potter books.'
        },
        {
          id: 10,
          name: 'Mystery',
          description:
            'Fiction that follows a crime (e.g., a murder, a disappearance) as it is committed, investigated, and solved, as well as providing clues and revealing information/secrets as the story unfolds.['
        },
        {
          id: 11,
          name: 'Crime',
          description:
            'Centers on a crime(s), how the criminal gets caught and serves time, and the repercussions of the crime.'
        },
        {
          id: 12,
          name: 'Biography',
          description:
            'Narrative of a person&rsquo;s life; an autobiography is a self-written biography.'
        },
        {
          id: 13,
          name: 'History',
          description:
            'Works that take place in the past—which can be real, imagined, or a combination of both.[1] Many such works involve actual historical figures or historical events within historical settings.'
        },
        {
          id: 14,
          name: 'Western',
          description:
            'Works that follow cowboys, settlers, and outlaws exploring the American frontier and Old West, typically in the late-19th to early-20th century.'
        },
        {
          id: 15,
          name: 'Animation',
          description: ''
        },
        {
          id: 16,
          name: 'Family',
          description: ''
        },
        {
          id: 17,
          name: 'Children',
          description:
            'Includes stories, books, magazines, and poems that are created for children. Modern children&rsquo;s literature is classified in two different ways: genre or the intended age of the reader.'
        },
        {
          id: 18,
          name: 'Sport',
          description: ''
        },
        {
          id: 19,
          name: 'War',
          description: ''
        },
        {
          id: 20,
          name: 'Adventure',
          description: ''
        },
        {
          id: 21,
          name: 'Musical',
          description:
            'Fiction in which music is paramount: both as subject matter, and through the rhythm and flow of the prose; that is, music is manifested through the language itself.'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Genres', null, {});
  }
};
