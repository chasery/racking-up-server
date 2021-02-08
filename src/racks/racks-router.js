const express = require('express');
const RacksService = require('./racks-service');
const { requireAuth } = require('../middleware/jwt-auth');

const racksRouter = express.Router();

racksRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.user;

    RacksService.getUserRacks(req.app.get('db'), id)
      .then((racks) => {
        res.json(racks.map(RacksService.serializeRack));
      })
      .catch(next);
  });

module.exports = racksRouter;
