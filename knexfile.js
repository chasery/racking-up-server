require("dotenv").config();
const { DATABASE_URL } = require("./src/config");

module.exports = {
  development: {
    client: "pg",
    connection: DATABASE_URL,
  },
};
