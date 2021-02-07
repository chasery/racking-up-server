exports.seed = async function (knex, Promise) {
  // Delete table data
  await knex('ru_racks').del();
  await knex('ru_users').del();
  // Reset ru_users auto increment back to 1
  await knex.raw('ALTER SEQUENCE ru_users_id_seq RESTART WITH 1');

  // Insert users into table
  await knex('ru_users').insert([
    {
      email: 'jim.halpert@gmail.com',
      password: '$2a$12$aH2M3RAplWD8lzMYXRGpROSQRza/d9HICs1qbDPPnHp0o/B9729I.',
      name: 'Jim',
    },
    {
      email: 'worldsbestboss@aol.com',
      password: '$2a$12$5kEbJlYTZXZatDAWUuCuxudCboiOE8.8snO34xbFLhMxSMHPwyYJ6',
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
      password: '$2a$12$hEh1U/A2dpGG3tFjTW95iOB3Yasr7Ib/bal5AZfUyJwj0noFgWn0y',
      name: 'Dwight',
    },
    {
      email: 'ryan@howard.com',
      password: '$2a$12$eiwkEPAR2GdRb9PWBJcf6uF/6rwgtBALqDZrd1JX3qzGFoz68PeAa',
      name: 'R Howard',
    },
  ]);
  // Insert racks into table
  await knex('ru_racks').insert([
    {
      rack_id: 1,
      rack_name: 'Office Wear',
      user_id: 1,
    },
    {
      rack_id: 2,
      rack_name: "Michael's Run",
      user_id: 1,
    },
    {
      rack_id: 3,
      rack_name: 'Rack 3',
      user_id: 2,
    },
    {
      rack_id: 4,
      rack_name: 'Rack 4',
      user_id: 3,
    },
    {
      rack_id: 5,
      rack_name: 'Rack 5',
      user_id: 4,
    },
    {
      rack_id: 6,
      rack_name: 'Rack 6',
      user_id: 5,
    },
  ]);
};
