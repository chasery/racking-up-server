const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Racks Endpoints', function () {
  let db;

  const { testUsers, testRacks, testRackItems } = helpers.makeRacksFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  before('Clean tables', () => helpers.cleanTable(db));

  afterEach('Clean tables', () => helpers.cleanTable(db));

  after('Destroy db connection', () => db.destroy());

  describe.only(`POST /api/rack-items`, () => {
    beforeEach('insert racks', () =>
      helpers.seedRacksTables(db, testUsers, testRacks, testRackItems)
    );

    const requiredFields = ['item_name', 'item_price', 'rack_id'];

    requiredFields.forEach((field) => {
      const newRackItem = {
        item_name: 'Beets Sweater',
        item_price: 39.99,
        rack_id: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRackItem[field];

        return supertest(app)
          .post('/api/rack-items')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newRackItem)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds with 201 and the new rack`, function () {
      this.retries(3);
      const newRackItem = {
        item_name: 'Beets Sweater',
        item_price: 39.99,
        item_url: 'https://www.beet-sweaters.com/beet-sweater-1',
        rack_id: 1,
      };

      return supertest(app)
        .post('/api/rack-items')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newRackItem)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('item_id');
          expect(res.body.item_name).to.eql(newRackItem.item_name);
          expect(res.body.item_url).to.eql(newRackItem.item_url);
          expect(res.body.item_price).to.eql(newRackItem.item_price);
          expect(res.body.rack_id).to.eql(newRackItem.rack_id);
          expect(res.body.user_id).to.eql(testUser.id);
          expect(res.headers.location).to.eql(
            `/api/rack-items/${res.body.item_id}`
          );
          const expectedDate = new Date().toLocaleString();
          const actualDate = new Date(res.body.created_at).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect((res) =>
          db
            .from('ru_rack_items')
            .select('*')
            .where({ item_id: res.body.item_id })
            .first()
            .then((row) => {
              expect(row.item_name).to.eql(newRackItem.item_name);
              expect(row.item_url).to.eql(newRackItem.item_url);
              expect(row.item_price).to.eql(newRackItem.item_price);
              expect(row.rack_id).to.eql(newRackItem.rack_id);
              expect(row.user_id).to.eql(testUser.id);
              const expectedDate = new Date().toLocaleString();
              const actualDate = new Date(row.created_at).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });
  });
});