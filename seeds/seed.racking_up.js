exports.seed = async function (knex, Promise) {
  // Delete table data
  await knex('ru_rack_items').del();
  await knex('ru_racks').del();
  await knex('ru_users').del();
  // Reset users, racks, rack_items tables auto increment back to 1
  await knex.raw('ALTER SEQUENCE ru_rack_items_item_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE ru_racks_rack_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE ru_users_id_seq RESTART WITH 1');

  // Insert users into table
  await knex('ru_users').insert([
    {
      email: 'jim.halpert@racking-up.com',
      password: '$2a$12$EYP5KmU/0BjyUeXmqDenJeNHVXZUZYYRK8BaIBYl041Fde2Vwg0dC',
      name: 'Jim',
    },
    {
      email: 'worldsbestboss@aol.com',
      password: '$2a$12$5kEbJlYTZXZatDAWUuCuxudCboiOE8.8snO34xbFLhMxSMHPwyYJ6',
      name: 'Michael Scott',
    },
    {
      email: 'pambeasley2k@gmail.com',
      password: '$2a$12$UjSUtgQK92QqqXr5ydRfI.xD.klcgaW37FsYLa1yIyD7iJrpD1a4e',
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
      item_name: 'Yellow Button Down Shirt',
      item_price: 49.99,
      item_url:
        'https://www.amazon.com/Amazon-Essentials-Regular-Fit-Short-Sleeve-Pocket/dp/B07F2546VW/ref=sxin_10_pb?crid=2VHHZ5SBR86KK&cv_ct_cx=yellow+button+down+shirt+men&dchild=1&keywords=yellow+button+down+shirt+men&pd_rd_i=B07F2546VW&pd_rd_r=deb48642-0554-430e-87b9-78be87f84315&pd_rd_w=3CqjI&pd_rd_wg=saG9Q&pf_rd_p=71ddec52-26fa-4a77-b635-e3d3fa4f7c5a&pf_rd_r=HMAT6SQPJMZ10A09NWJ4&psc=1&qid=1613060560&sprefix=yellow+button+down%2Caps%2C224&sr=1-3-8065ff8c-2587-4a7f-b8da-1df8b2563c11',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Blazer Jacket',
      item_price: 109.99,
      item_url:
        'https://www.amazon.com/U-S-Polo-Assn-Blend-Regular/dp/B014PGPA4K/ref=sr_1_41?crid=1TX75ZFFW5SVH&dchild=1&keywords=brown+blazer+jacket+men&qid=1613060606&sprefix=Brown+blazer+jacket%2Caps%2C223&sr=8-41',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Fake Glasses',
      item_price: 24.99,
      item_url:
        'https://www.amazon.com/Calabria-8151-Lightweight-Comfortable-Aviator/dp/B01HSLEEEG/ref=sr_1_1_sspa?dchild=1&keywords=dwight+schrute+glasses&qid=1613060743&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzVUpMVUdSWDU4QllYJmVuY3J5cHRlZElkPUEwOTg5NzM0NDc2VjU1Wk5BMDdSJmVuY3J5cHRlZEFkSWQ9QTAzNTAxNjIxRlI2SDlYREpQQlBPJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==',
      user_id: 1,
      rack_id: 1,
    },
    {
      item_name: 'Top Hat',
      item_price: 79.99,
      item_url:
        'https://www.amazon.com/dp/B008IM5EG2/ref=redir_mobile_desktop?_encoding=UTF8&aaxitk=6Wfq89GEa2nskTMFGpgo1A&hsa_cr_id=2398680170101&pd_rd_r=43a10f8a-b591-4b4a-bd3b-3a2d53aabc34&pd_rd_w=9oj8B&pd_rd_wg=xZlQE&ref_=sbx_be_s_sparkle_tsld_asin_0',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Black Cloak',
      item_price: 59.99,
      item_url:
        'https://www.amazon.com/ACSUSS-Magician-Costume-Gloves-Accessories/dp/B07VCHMX8P/ref=sr_1_1?dchild=1&keywords=magicians+cloak&qid=1613060806&sr=8-1',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Bunny',
      item_price: 80.0,
      item_url:
        'https://www.freshpatch.com/products/rabbit-patch-farm-fresh-grass-pad-standard?variant=32328509096002&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gclid=Cj0KCQiAyJOBBhDCARIsAJG2h5cJ29yES0gOc8y1AHKUKFC9sv4h6M92Ey2odwd0528dtk1lOohKRZsaAr6HEALw_wcB',
      user_id: 2,
      rack_id: 3,
    },
    {
      item_name: 'Beautiful Dress',
      item_price: 1099.99,
      item_url:
        'https://www.bhldn.com/products/piper-gown-ivory?gclid=Cj0KCQiAyJOBBhDCARIsAJG2h5drnOJp5dHBj5k39C3W2H5T9HSfS6iS1vp0qw-4qBTno0GvGDRJdF4aAo6ZEALw_wcB&gclsrc=aw.ds',
      user_id: 3,
      rack_id: 4,
    },
    {
      item_name: 'Reception Shoes',
      item_price: 101.99,
      item_url:
        'https://www.katespade.com/products/keds-x-kate-spade-new-york-champion-glitter-sneakers/884547076649.html?KSNY=true&ogmap=PLA|RTN|GOOG|STND|c|SITEWIDE|Main|pla_ecomm_main_gg_nbrt_us_en_shoes_w_shopping|pla_ecomm_main_gg_nbrt_us_en_shoes_w_sneakers||7960786307|87827485128|US&k_clickid=_k_Cj0KCQiAyJOBBhDCARIsAJG2h5dIFBKMCWWfjzRLXRT4QLPQyRFmA_54zS_pQGhfLZdA63ID5K74SToaAkNVEALw_wcB_k_&utm_source=google&utm_id=go_cmp-7960786307_adg-87827485128_ad-394954992866_pla-345117679652_dev-c_ext-_sig-Cj0KCQiAyJOBBhDCARIsAJG2h5dIFBKMCWWfjzRLXRT4QLPQyRFmA_54zS_pQGhfLZdA63ID5K74SToaAkNVEALw_wcB&gclid=Cj0KCQiAyJOBBhDCARIsAJG2h5dIFBKMCWWfjzRLXRT4QLPQyRFmA_54zS_pQGhfLZdA63ID5K74SToaAkNVEALw_wcB',
      user_id: 3,
      rack_id: 4,
    },
    {
      item_name: 'Square Famed Glasses',
      item_price: 89.99,
      item_url:
        'https://www.amazon.com/dp/B088JPW8PD?pd_rd_i=B088JPW8PD&pd_rd_w=aVAAY&pf_rd_p=51cf0d17-50cf-4c89-b1a7-606703cfac11&pd_rd_wg=8wN7n&pf_rd_r=97ZZQVZK39WZ5XQK28AB&pd_rd_r=ebc075f3-6e2c-4eb0-bb64-9faef74a607b',
      user_id: 3,
      rack_id: 5,
    },
    {
      item_name: 'Cute Blouse',
      item_price: 49.99,
      item_url:
        'https://www.amazon.com/Romwe-Frilled-Ruffles-Shoulder-Keyhole/dp/B07JZKC4SB/ref=sr_1_32?dchild=1&keywords=cute+blouse&qid=1613060995&sr=8-32',
      user_id: 3,
      rack_id: 5,
    },
    {
      item_name: 'Pencil Skirt',
      item_price: 59.99,
      item_url:
        'https://www.amazon.com/EXCHIC-Womens-Waist-Bodycon-Pencil/dp/B07G34MKW8/ref=sr_1_2_sspa?dchild=1&keywords=pencil+skirt&qid=1613061041&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyOFBMUklKUzUwWlVEJmVuY3J5cHRlZElkPUEwODcwNDQ5MkVVNEtUSldNMDJXUSZlbmNyeXB0ZWRBZElkPUEwNDU4MzcxMlM0WFo2MlRIWlhWNSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=',
      user_id: 3,
      rack_id: 5,
    },
  ]);
};
