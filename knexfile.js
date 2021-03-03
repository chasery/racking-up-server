require('dotenv').config();
const { DATABASE_URL, TEST_DATABASE_URL } = require('./src/config');

module.exports = {
  development: {
    client: 'pg',
    connection: DATABASE_URL,
  },
  test: {
    client: 'pg',
    connection: TEST_DATABASE_URL,
  },
};
