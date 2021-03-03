const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeRacksFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTable(db));

  afterEach('cleanup', () => helpers.cleanTable(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

      const requiredFields = ['email', 'password'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          email: 'test@email.com',
          password: 'test password',
          name: 'test name',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      it(`responds 400 'Must be a valid email address' when not a valid email`, () => {
        const userBadEmail = {
          email: 'testemail',
          password: '1234567',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(userBadEmail)
          .expect(400, { error: `Must be a valid email address` });
      });

      it(`responds 400 'Password must be longer than 8 characters' when short password`, () => {
        const userShortPassword = {
          email: 'test@email.com',
          password: '1234567',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` });
      });

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          email: 'test@email.com',
          password: '*'.repeat(73),
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          email: 'test@email.com',
          password: ' 1Aa!2Bb@',
          name: 'test name',
        };

        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          email: 'test@email.com',
          password: '1Aa!2Bb@ ',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          email: 'test@email.com',
          password: '11AAaabb',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `Password must contain 1 upper case, lower case, number and special character`,
          });
      });

      it(`responds 400 'User with that email already exists' when email isn't unique`, () => {
        const duplicateUser = {
          email: testUser.email,
          password: '11AAaa!!',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `User with that email already exists` });
      });
    });

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          email: 'test@email.com',
          password: '11AAaa!!',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property('id');
            expect(res.body.email).to.eql(newUser.email);
            expect(res.body.name).to.eql(newUser.name);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
            const expectedDate = new Date().toLocaleString('en', {
              timeZone: 'UTC',
            });
            const actualDate = new Date(res.body.created_at).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
          .expect((res) =>
            db
              .from('ru_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.email).to.eql(newUser.email);
                expect(row.name).to.eql(newUser.full_name);
                const expectedDate = new Date().toLocaleString('en', {
                  timeZone: 'UTC',
                });
                const actualDate = new Date(row.created_at).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
