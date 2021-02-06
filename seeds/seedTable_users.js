exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('ru_users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('ru_users').insert([
        {
          email: 'jim.halpert@gmail.com',
          password:
            '$2a$12$aH2M3RAplWD8lzMYXRGpROSQRza/d9HICs1qbDPPnHp0o/B9729I.',
          name: 'Jim',
        },
        {
          email: 'worldsbestboss@aol.com',
          password:
            '$2a$12$5kEbJlYTZXZatDAWUuCuxudCboiOE8.8snO34xbFLhMxSMHPwyYJ6',
          name: 'Michael Scott',
        },
        {
          email: 'pambeasley2k@gmail.com',
          password:
            'this-password$2a$12$UjSUtgQK92QqqXr5ydRfI.xD.klcgaW37FsYLa1yIyD7iJrpD1a4e',
          name: '',
        },
        {
          email: 'dschrute@hotmail.com',
          password:
            '$2a$12$hEh1U/A2dpGG3tFjTW95iOB3Yasr7Ib/bal5AZfUyJwj0noFgWn0y',
          name: 'Dwight',
        },
        {
          email: 'ryan@howard.com',
          password:
            '$2a$12$eiwkEPAR2GdRb9PWBJcf6uF/6rwgtBALqDZrd1JX3qzGFoz68PeAa',
          name: 'R Howard',
        },
      ]);
    });
};
