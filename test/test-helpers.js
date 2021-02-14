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
      rack_name: "Magician's Outfit",
      user_id: 2,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      rack_id: 3,
      rack_name: 'Waterfall Wedding Wear',
      user_id: 3,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeRackItemsArray() {
  return [
    {
      item_id: 1,
      item_name: 'Yellow Button Down Shirt',
      item_price: 49.99,
      item_url:
        'https://www.amazon.com/Amazon-Essentials-Regular-Fit-Short-Sleeve-Pocket/dp/B07F2546VW/ref=sxin_10_pb?crid=2VHHZ5SBR86KK&cv_ct_cx=yellow+button+down+shirt+men&dchild=1&keywords=yellow+button+down+shirt+men&pd_rd_i=B07F2546VW&pd_rd_r=deb48642-0554-430e-87b9-78be87f84315&pd_rd_w=3CqjI&pd_rd_wg=saG9Q&pf_rd_p=71ddec52-26fa-4a77-b635-e3d3fa4f7c5a&pf_rd_r=HMAT6SQPJMZ10A09NWJ4&psc=1&qid=1613060560&sprefix=yellow+button+down%2Caps%2C224&sr=1-3-8065ff8c-2587-4a7f-b8da-1df8b2563c11',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_id: 2,
      item_name: 'Blazer Jacket',
      item_price: 109.99,
      item_url:
        'https://www.amazon.com/U-S-Polo-Assn-Blend-Regular/dp/B014PGPA4K/ref=sr_1_41?crid=1TX75ZFFW5SVH&dchild=1&keywords=brown+blazer+jacket+men&qid=1613060606&sprefix=Brown+blazer+jacket%2Caps%2C223&sr=8-41',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_id: 3,
      item_name: 'Fake Glasses',
      item_price: 24.99,
      item_url:
        'https://www.amazon.com/Calabria-8151-Lightweight-Comfortable-Aviator/dp/B01HSLEEEG/ref=sr_1_1_sspa?dchild=1&keywords=dwight+schrute+glasses&qid=1613060743&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzVUpMVUdSWDU4QllYJmVuY3J5cHRlZElkPUEwOTg5NzM0NDc2VjU1Wk5BMDdSJmVuY3J5cHRlZEFkSWQ9QTAzNTAxNjIxRlI2SDlYREpQQlBPJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_id: 4,
      item_name: 'Top Hat',
      item_price: 79.99,
      item_url:
        'https://www.amazon.com/dp/B008IM5EG2/ref=redir_mobile_desktop?_encoding=UTF8&aaxitk=6Wfq89GEa2nskTMFGpgo1A&hsa_cr_id=2398680170101&pd_rd_r=43a10f8a-b591-4b4a-bd3b-3a2d53aabc34&pd_rd_w=9oj8B&pd_rd_wg=xZlQE&ref_=sbx_be_s_sparkle_tsld_asin_0',
      user_id: 2,
      rack_id: 2,
    },
    {
      item_id: 5,
      item_name: 'Beautiful Dress',
      item_price: 1099.99,
      item_url:
        'https://www.bhldn.com/products/piper-gown-ivory?gclid=Cj0KCQiAyJOBBhDCARIsAJG2h5drnOJp5dHBj5k39C3W2H5T9HSfS6iS1vp0qw-4qBTno0GvGDRJdF4aAo6ZEALw_wcB&gclsrc=aw.ds',
      user_id: 3,
      rack_id: 3,
    },
  ];
}

function makeExpectedRack(rack) {
  return {
    rack_id: rack.rack_id,
    rack_name: rack.rack_name,
    user_id: rack.user_id,
    created_at: rack.created_at.toISOString(),
  };
}

function makeExpectedRackItem(rackId, rackItems) {
  const expectedRackItems = rackItems.filter((item) => item.rack_id === rackId);

  return expectedRackItems.map((item) => {
    return {
      item_id: item.item_id,
      item_name: item.item_name,
      item_price: item.item_price,
      item_url: item.item_url,
      user_id: item.user_id,
      rack_id: item.rack_id,
      created_at: item.created_at.toISOString(),
    };
  });
}

function makeMaliciousRack(user) {
  const maliciousRack = {
    rack_id: 911,
    rack_name: `Naughty naughty very naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id,
    created_at: new Date(),
  };
  const expectedRack = {
    ...makeExpectedRack(maliciousRack),
    rack_name: `Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousRack,
    expectedRack,
  };
}

function makeMaliciousRackItem(user, rack) {
  const maliciousRackItem = {
    item_id: 911,
    item_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    item_price: 911.99,
    item_url: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id,
    rack_id: rack.rack_id,
    created_at: new Date(),
  };
  const expectedRackItem = {
    ...makeExpectedRack(maliciousRackItem),
    item_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    item_url: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousRackItem,
    expectedRackItem,
  };
}

function makeRacksFixtures() {
  const testUsers = makeUsersArray();
  const testRacks = makeRacksArray();
  const testRackItems = makeRackItemsArray();

  return { testUsers, testRacks, testRackItems };
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

function seedRacksTables(db, users, racks, rackItems = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into('ru_racks').insert(racks);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('ru_racks_rack_id_seq', ?)`, [
      racks[racks.length - 1].rack_id,
    ]);
    if (rackItems.length) {
      await trx.into('ru_rack_items').insert(rackItems);
      await trx.raw(`SELECT setval('ru_rack_items_item_id_seq', ?)`, [
        rackItems[rackItems.length - 1].item_id,
      ]);
    }
  });
}

function seedMaliciousRack(db, user, rack) {
  return seedUsers(db, [user]).then(() => db.into('ru_racks').insert([rack]));
}

function cleanTable(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        ru_rack_items,
        ru_racks,
        ru_users
    `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE ru_rack_items_item_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE ru_racks_rack_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`ALTER SEQUENCE ru_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('ru_rack_items_item_id_seq', 0)`),
          trx.raw(`SELECT setval('ru_racks_rack_id_seq', 0)`),
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
  makeRackItemsArray,
  makeExpectedRack,
  makeExpectedRackItem,
  makeMaliciousRack,
  makeMaliciousRackItem,
  makeRacksFixtures,
  seedUsers,
  seedRacksTables,
  seedMaliciousRack,
  cleanTable,
  makeAuthHeader,
};
