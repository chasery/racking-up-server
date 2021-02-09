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

  before('Clean tables', () => helpers.cleanTable(db));

  afterEach('Clean tables', () => helpers.cleanTable(db));

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
        const expectedRacks = testRacks
          .filter((rack) => rack.user_id === testUser.id)
          .map((rack) => helpers.makeExpectedRack(rack));

        return supertest(app)
          .get('/api/racks')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRacks);
      });
    });

    context(`Given an XSS attack article`, () => {
      const { maliciousRack, expectedRack } = helpers.makeMaliciousRack(
        testUser
      );

      beforeEach('insert malicious article', () => {
        return helpers.seedMaliciousRack(db, testUser, maliciousRack);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/racks')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].rack_name).to.eql(expectedRack.rack_name);
          });
      });
    });
  });

  describe(`GET /api/racks/:rack_id`, () => {
    context(`Given no racks`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const rack_id = 123456;
        return supertest(app)
          .get(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Rack doesn't exist` });
      });
    });

    context(`Given testUser has racks`, () => {
      beforeEach('insert racks', () =>
        helpers.seedRacksTables(db, testUsers, testRacks)
      );

      it("responds with 200 and only the userId's racks", () => {
        const rack_id = 1;
        const expectedRack = helpers.makeExpectedRack(
          testRacks.find((rack) => rack.rack_id === rack_id)
        );

        return supertest(app)
          .get(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRack);
      });
    });

    context(`Given an XSS attack article`, () => {
      const { maliciousRack, expectedRack } = helpers.makeMaliciousRack(
        testUser
      );

      beforeEach('insert malicious article', () => {
        return helpers.seedMaliciousRack(db, testUser, maliciousRack);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/racks/${maliciousRack.rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.rack_name).to.eql(expectedRack.rack_name);
          });
      });
    });
  });
});
