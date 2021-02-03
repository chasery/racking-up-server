const bcrypt = require('bcryptjs');
// const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'jim.halpert@gmail.com',
      password: 'password',
      name: 'Jim',
    },
    {
      id: 2,
      email: 'worldsbestboss@aol.com',
      password: 'test-password',
      name: 'Michael Scott',
    },
    {
      id: 3,
      email: 'pambeasley2k@gmail.com',
      password: 'this-password',
      name: 'Pamlette',
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

module.exports = {
  makeUsersArray,
  makeRacksFixtures,
  seedUsers,
  cleanTable,
};
