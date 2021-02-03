const bcrypt = require('bcryptjs');
// const jwt = require("jsonwebtoken");
// const config = require("../config");

const AuthService = {
  getUserByEmail(db, email) {
    return db('ru_users').where({ email }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

module.exports = AuthService;
