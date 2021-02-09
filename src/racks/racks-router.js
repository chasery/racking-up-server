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

racksRouter
  .route('/:rack_id')
  .all(requireAuth)
  .all(checkRackExists)
  .get((req, res) => {
    res.json(RacksService.serializeRack(res.rack));
  });

async function checkRackExists(req, res, next) {
  try {
    const rack = await RacksService.getById(
      req.app.get('db'),
      req.user.id,
      req.params.rack_id
    );

    if (!rack)
      return res.status(404).json({
        error: `Rack doesn't exist`,
      });

    res.rack = rack;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = racksRouter;
