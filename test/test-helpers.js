const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'jim.halpert@gmail.com',
      password: 'password',
      name: 'Jim',
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      email: 'worldsbestboss@aol.com',
      password: 'test-password',
      name: 'Michael Scott',
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      email: 'pambeasley2k@gmail.com',
      password: 'this-password',
      name: 'Pamlette',
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeRacksArray() {
  return [
    {
      rack_id: 1,
      rack_name: 'Office Wear',
      user_id: 1,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      rack_id: 2,
      rack_name: "Meredith's Run",
      user_id: 1,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      rack_id: 3,
      rack_name: "Magician's Outfit",
      user_id: 2,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      rack_id: 4,
      rack_name: 'Waterfall Wedding Wear',
      user_id: 3,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      rack_id: 5,
      rack_name: 'Art School',
      user_id: 3,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedRacks(user, racks) {
  return racks
    .filter((rack) => rack.user_id === user.id)
    .map((rack) => ({
      rack_id: rack.rack_id,
      rack_name: rack.rack_name,
      user_id: rack.user_id,
      created_at: rack.created_at.toISOString(),
    }));
}

function makeMaliciousRack(user) {
  const maliciousRack = {
    rack_id: 911,
    rack_name: `Naughty naughty very naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id,
    created_at: new Date(),
  };
  const expectedRack = {
    ...makeExpectedRack([user], maliciousRack),
    rack_name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousRack,
    expectedRack,
  };
}

function makeRacksFixtures() {
  const testUsers = makeUsersArray();
  const testRacks = makeRacksArray();

  return { testUsers, testRacks };
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

function seedRacksTables(db, users, racks = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into('ru_racks').insert(racks);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('ru_racks_rack_id_seq', ?)`, [
      racks[racks.length - 1].rack_id,
    ]);
  });
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
  makeRacksArray,
  makeExpectedRacks,
  makeMaliciousRack,
  makeRacksFixtures,
  seedUsers,
  seedRacksTables,
  cleanTable,
  makeAuthHeader,
};
