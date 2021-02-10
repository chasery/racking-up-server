const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected endpoints', function () {
  let db;

  const { testUsers } = helpers.makeRacksFixtures();

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

  beforeEach('insert articles', () => helpers.seedUsers(db, testUsers));

  const protectedEndpoints = [
    {
      name: 'POST /api/auth/refresh',
      path: '/api/auth/refresh',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/racks',
      path: '/api/racks',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/racks/:rack_id',
      path: '/api/racks/1',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/racks',
      path: '/api/racks',
      method: supertest(app).post,
    },
    {
      name: 'PATCH /api/racks/:rack_id',
      path: '/api/racks/1',
      method: supertest(app).patch,
    },
  ];

  protectedEndpoints.forEach((endpoint) => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint
          .method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';

        return endpoint
          .method(endpoint.path)
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { email: 'bad@email.com', id: 1 };

        return endpoint
          .method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });
  });
});
