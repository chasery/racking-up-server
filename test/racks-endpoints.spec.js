const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Racks Endpoints', function () {
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
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

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
        return helpers.seedRacksTables(db, testUsers, [maliciousRack]);
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
        return helpers.seedRacksTables(db, testUsers, [maliciousRack]);
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

  describe(`POST /api/racks`, () => {
    beforeEach('insert racks', () =>
      helpers.seedRacksTables(db, testUsers, testRacks)
    );

    it(`responds with 400 and an error message when the 'rack_name' is missing`, () => {
      const newRack = {};

      return supertest(app)
        .post('/api/racks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newRack)
        .expect(400, {
          error: `Missing 'rack_name' in request body`,
        });
    });

    it(`responds with 201 and the new rack`, function () {
      this.retries(3);
      const newRack = {
        rack_name: 'Test new rack',
      };

      return supertest(app)
        .post('/api/racks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newRack)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('rack_id');
          expect(res.body.rack_name).to.eql(newRack.rack_name);
          expect(res.body.user_id).to.eql(testUser.id);
          expect(res.headers.location).to.eql(`/api/racks/${res.body.rack_id}`);
          const expectedDate = new Date().toLocaleString();
          const actualDate = new Date(res.body.created_at).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect((res) =>
          db
            .from('ru_racks')
            .select('*')
            .where({ rack_id: res.body.rack_id })
            .first()
            .then((row) => {
              expect(row.rack_name).to.eql(newRack.rack_name);
              expect(row.user_id).to.eql(testUser.id);
              const expectedDate = new Date().toLocaleString();
              const actualDate = new Date(row.created_at).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });
  });

  describe('PATCH /api/racks/:rack_id', () => {
    context('Given no racks', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('responds with a 404', () => {
        const rack_id = 123456;
        const updateToRack = {
          rack_name: 'BEET IT',
        };

        return supertest(app)
          .patch(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRack)
          .expect(404, { error: "Rack doesn't exist" });
      });
    });

    context('Given there are racks', () => {
      beforeEach('insert racks', () =>
        helpers.seedRacksTables(db, testUsers, testRacks)
      );

      it('responds with 204 and rack is updated', () => {
        const rack_id = 1;
        const updateToRack = {
          rack_name: 'BEET IT',
        };
        let expectedRack = helpers.makeExpectedRack(testRacks[rack_id - 1]);
        expectedRack = {
          ...expectedRack,
          ...updateToRack,
        };

        return supertest(app)
          .patch(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRack)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/racks/${rack_id}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedRack)
          );
      });

      it('rsponds with 204 and ignores bad key value pair', () => {
        const rack_id = 1;
        const updateToRack = {
          rack_name: 'BEET IT',
        };
        let expectedRack = helpers.makeExpectedRack(testRacks[rack_id - 1]);
        expectedRack = {
          ...expectedRack,
          ...updateToRack,
        };

        return supertest(app)
          .patch(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send({
            ...updateToRack,
            fieldToIgnore: 'this should not be in the GET response',
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/racks/${rack_id}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedRack)
          );
      });

      it('responds with 400 when no required fields supplied', () => {
        const rack_id = 1;

        return supertest(app)
          .patch(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: "Missing 'rack_name' in request body",
          });
      });

      it('responds with 401 when rack user_id !== auth user_id', () => {
        const rack_id = 3;
        const updateToRack = {
          rack_name: 'BEET IT',
        };
        let expectedRack = helpers.makeExpectedRack(testRacks[rack_id - 1]);
        expectedRack = {
          ...expectedRack,
          ...updateToRack,
        };

        return supertest(app)
          .patch(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRack)
          .expect(401, {
            error: `Unauthorized request`,
          });
      });
    });
  });

  describe('DELETE /api/racks/:rack_id', () => {
    context('Given no racks', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('responds with 404', () => {
        const rack_id = 123456;

        return supertest(app)
          .delete(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: "Rack doesn't exist" });
      });
    });

    context('Given there are racks', () => {
      beforeEach('insert racks', () =>
        helpers.seedRacksTables(db, testUsers, testRacks)
      );

      it('responds with 204 and the folder is deleted in the db', () => {
        const rack_id = 1;
        const expectedRacks = testRacks
          .filter(
            (rack) => rack.rack_id !== rack_id && rack.user_id === testUser.id
          )
          .map((rack) => helpers.makeExpectedRack(rack));

        return supertest(app)
          .delete(`/api/racks/${rack_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204)
          .then((res) =>
            supertest(app)
              .get('/api/racks')
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedRacks)
          );
      });
    });
  });
});
