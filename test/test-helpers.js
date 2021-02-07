const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'jim.halpert@gmail.com',
      password: 'password',
      name: 'Jim',
      created_at: '2021-02-03 10:20:43',
    },
    {
      id: 2,
      email: 'worldsbestboss@aol.com',
      password: 'test-password',
      name: 'Michael Scott',
      created_at: '2021-02-03 10:20:43',
    },
    {
      id: 3,
      email: 'pambeasley2k@gmail.com',
      password: 'this-password',
      name: 'Pamlette',
      created_at: '2021-02-03 10:20:43',
    },
  ];
}

function makeRacksFixtures() {
  const testUsers = makeUsersArray();

  return { testUsers };
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db
    .into('ru_users')
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('ru_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function cleanTable(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        ru_racks,
        ru_users
    `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE ru_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('ru_users_id_seq', 0)`),
        ])
      )
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeRacksFixtures,
  seedUsers,
  cleanTable,
  makeAuthHeader,
};
