const express = require('express');
const path = require('path');
const RacksService = require('./racks-service');
const { requireAuth } = require('../middleware/jwt-auth');

const racksRouter = express.Router();
const jsonBodyParser = express.json();

racksRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    RacksService.getUserRacks(req.app.get('db'), req.user.id)
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

racksRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { rack_name } = req.body;
  const newRack = { rack_name };

  for (const [key, value] of Object.entries(newRack))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  newRack.user_id = req.user.id;

  RacksService.insertRack(req.app.get('db'), req.user.id, newRack)
    .then((rack) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${rack.rack_id}`))
        .json(RacksService.serializeRack(rack));
    })
    .catch(next);
});

module.exports = racksRouter;
