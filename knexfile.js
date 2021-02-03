require('dotenv').config();
const { DB_URL, TEST_DB_URL } = require('./src/config');

module.exports = {
  development: {
    client: 'pg',
    connection: DB_URL,
  },
  test: {
    client: 'pg',
    connection: TEST_DB_URL,
  },
};
