const express = require('express');
const path = require('path');
const RackItemsService = require('./rackItems-service');
const { requireAuth } = require('../middleware/jwt-auth');

const rackItemsRouter = express.Router();
const jsonBodyParser = express.json();

rackItemsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    res.json([]);
  });

module.exports = rackItemsRouter;
