const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Racks Endpoints', function () {
  let db;

  const { testUsers, testRacks } = helpers.makeRacksFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  before('Clean users table', () => helpers.cleanTable(db));

  afterEach('Clean users table', () => helpers.cleanTable(db));

  after('Destroy db connection', () => db.destroy());

  describe(`GET /api/racks`, () => {
    context(`Given testUser has no racks`, () => {
      beforeEach('insert racks', () => helpers.seedUsers(db, testUsers));

      it(`responds with 200 and no racks for userId`, () => {
        return supertest(app)
          .get('/api/racks')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, []);
      });
    });

    context(`Given testUser has racks`, () => {
      beforeEach('insert racks', () =>
        helpers.seedRacksTables(db, testUsers, testRacks)
      );

      it("responds with 200 and only the userId's racks", () => {
        const expectedRacks = helpers.makeExpectedRacks(testUser, testRacks);

        return supertest(app)
          .get('/api/racks')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRacks);
      });
    });
  });
});
