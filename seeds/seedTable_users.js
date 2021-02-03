exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('ru_users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('ru_users').insert([
        {
          email: 'jim.halpert@gmail.com',
          password: 'password',
          name: 'Jim',
        },
        {
          email: 'worldsbestboss@aol.com',
          password: 'test-password',
          name: 'Michael Scott',
        },
        {
          email: 'pambeasley2k@gmail.com',
          password: 'this-password',
          name: '',
        },
        {
          email: 'dschrute@hotmail.com',
          password: 'assistant-password',
          name: 'Dwight',
        },
        {
          email: 'ryan@howard@gmail.com',
          password: 'best-password',
          name: 'R Howard',
        },
      ]);
    });
};
