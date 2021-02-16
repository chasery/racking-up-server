const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Racks Endpoints', function () {
  let db;

  const { testUsers, testRacks, testRackItems } = helpers.makeRacksFixtures();
  const testUser = testUsers[0];
  const testRack = testRacks[0];

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

  describe(`GET /api/rack-items/:itemId`, () => {
    context(`Given no racks`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const item_id = 123456;
        return supertest(app)
          .get(`/api/rack-items/${item_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Rack item doesn't exist` });
      });
    });

    context(`Given testUser has racks`, () => {
      beforeEach('insert racks and items', () =>
        helpers.seedRacksTables(db, testUsers, testRacks, testRackItems)
      );

      it("responds with 200 and only the userId's rack item", () => {
        const item_id = 1;
        const expectedRackItem = helpers.makeExpectedRackItem(
          item_id,
          testRackItems
        );

        return supertest(app)
          .get(`/api/rack-items/${item_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRackItem);
      });
    });

    context(`Given an XSS attack rack item`, () => {
      const {
        maliciousRackItem,
        expectedRackItem,
      } = helpers.makeMaliciousRackItem(testUser, testRack);

      beforeEach('insert malicious rack item', () => {
        return helpers.seedRacksTables(db, testUsers, testRacks, [
          maliciousRackItem,
        ]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/rack-items/${maliciousRackItem.item_id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.item_name).to.eql(expectedRackItem.item_name);
            expect(res.body.item_url).to.eql(expectedRackItem.item_url);
          });
      });
    });
  });

  describe(`POST /api/rack-items`, () => {
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

  describe('PATCH /api/rack-items/:itemId', () => {
    context('Given no rack items', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('responds with a 404', () => {
        const itemId = 123456;
        const updateToRackItem = {
          item_name: 'Beets Sweater',
          item_price: 39.99,
          item_url: 'https://www.beet-sweaters.com/beet-sweater-1',
        };

        return supertest(app)
          .patch(`/api/rack-items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRackItem)
          .expect(404, { error: "Rack item doesn't exist" });
      });
    });

    context('Given there are rack items', () => {
      beforeEach('insert racks', () =>
        helpers.seedRacksTables(db, testUsers, testRacks, testRackItems)
      );

      const requiredFields = ['item_name', 'item_price'];

      requiredFields.forEach((field) => {
        const itemId = 1;
        const updateToRackItem = {
          item_name: 'Beets Sweater',
          item_price: 39.99,
        };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete updateToRackItem[field];

          return supertest(app)
            .patch(`/api/rack-items/${itemId}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(updateToRackItem)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      it('responds with 204 and rack is updated', () => {
        const itemId = 1;
        const updateToRackItem = {
          item_name: 'Beets Sweater',
          item_price: 39.99,
          item_url: 'https://www.beet-sweaters.com/beet-sweater-1',
        };
        let expectedRackItem = helpers.makeExpectedRackItem(
          itemId,
          testRackItems
        );
        expectedRackItem = {
          ...expectedRackItem,
          ...updateToRackItem,
        };

        return supertest(app)
          .patch(`/api/rack-items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRackItem)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/rack-items/${itemId}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedRackItem)
          );
      });

      it('responds with 204 and ignores bad key value pair', () => {
        const itemId = 1;
        const updateToRackItem = {
          item_name: 'Beets Sweater',
          item_price: 39.99,
          item_url: 'https://www.beet-sweaters.com/beet-sweater-1',
        };
        let expectedRackItem = helpers.makeExpectedRackItem(
          itemId,
          testRackItems
        );
        expectedRackItem = {
          ...expectedRackItem,
          ...updateToRackItem,
        };

        return supertest(app)
          .patch(`/api/rack-items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send({
            ...updateToRackItem,
            fieldToIgnore: 'this should not be in the GET response',
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/rack-items/${itemId}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedRackItem)
          );
      });

      it('responds with 401 when item user_id !== auth user_id', () => {
        const itemId = 5;
        const updateToRackItem = {
          item_name: 'Beets Sweater',
          item_price: 39.99,
          item_url: 'https://www.beet-sweaters.com/beet-sweater-1',
        };
        let expectedRackItem = helpers.makeExpectedRackItem(
          itemId,
          testRackItems
        );
        expectedRackItem = {
          ...expectedRackItem,
          ...updateToRackItem,
        };

        return supertest(app)
          .patch(`/api/rack-items/${itemId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateToRackItem)
          .expect(401, {
            error: `Unauthorized request`,
          });
      });
    });
  });
});
