exports.seed = async function (knex, Promise) {
  // Delete table data
  await knex('ru_rack_items').del();
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
  ]);
  // Insert racks into table
  await knex('ru_racks').insert([
    {
      rack_name: 'Office Wear',
      user_id: 1,
    },
    {
      rack_name: "Michael's Run",
      user_id: 1,
    },
    {
      rack_name: "Magician's Outfit",
      user_id: 2,
    },
    {
      rack_name: 'Waterfall Wedding Wear',
      user_id: 3,
    },
    {
      rack_name: 'Art School',
      user_id: 3,
    },
  ]);
  // Insert rack items into table
  await knex('ru_rack_items').insert([
    {
      item_name: 'Yellow Button Down',
      item_price: 49.99,
      item_url: '',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Blazer Jacket',
      item_price: 109.99,
      item_url: '',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Fake Glasses',
      item_price: 24.99,
      item_url: '',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Top Hat',
      item_price: 79.99,
      item_url: '',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Black Cloak',
      item_price: 59.99,
      item_url: '',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Bunny',
      item_price: 80.0,
      item_url: '',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Beautiful Dress',
      item_price: 1099.99,
      item_url: '',
      user_id: 3,
      rack_id: 4,
    },
    {
      item_name: 'Reception Shoes',
      item_price: 101.99,
      item_url: '',
      user_id: 3,
      rack_id: 4,
    },
    {
      item_name: 'Square Famed Glasses',
      item_price: 89.99,
      item_url: '',
      user_id: 3,
      rack_id: 5,
    },
    {
      item_name: 'Cute Blouse',
      item_price: 49.99,
      item_url: '',
      user_id: 3,
      rack_id: 5,
    },
    {
      item_name: 'Pencil Skirt',
      item_price: 59.99,
      item_url: '',
      user_id: 3,
      rack_id: 5,
    },
  ]);
};
