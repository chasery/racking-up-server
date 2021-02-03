const knex = require('knex');
// const jwt = require("jsonwebtoken");
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', () => {
  let db;

  const { testUsers } = helpers.makeRacksFixtures();
  const testUser = testUsers[0];

  before('Make knex DB instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  before('Clean users table', () => {
    helpers.cleanTable(db);
  });

  afterEach('Clean users table', () => {
    helpers.cleanTable(db);
  });

  after('Destroy db connection', () => {
    db.destroy();
  });

  describe('POST /api/auth/login', () => {
    beforeEach('Insert users', () => {
      helpers.seedUsers(db, testUsers);
    });

    const requiredFields = ['email', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it("responds with 400 'Invalid email or password' when bad email", () => {
      const invalidUser = {
        email: 'bad@email.com',
        password: 'bad-password',
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUser)
        .expect(400, { error: 'Invalid email or password' });
    });
  });
});
