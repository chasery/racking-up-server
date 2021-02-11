const express = require('express');
const path = require('path');
const RacksService = require('./racks-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { checkRackExists } = require('../middleware/check-rack-exists');

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
  })
  .post(jsonBodyParser, (req, res, next) => {
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

racksRouter
  .route('/:rack_id')
  .all(requireAuth)
  .all(checkRackExists)
  .get((req, res) => {
    res.json(RacksService.serializeRack(res.rack));
    // Do some magic with 401 around unathorized user
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { rack_name } = req.body;
    const updatedRack = { rack_name };

    for (const [key, value] of Object.entries(updatedRack))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
    // 401
    // Do some magic with 401 around unathorized user

    RacksService.updateRack(
      req.app.get('db'),
      req.user.id,
      req.params.rack_id,
      updatedRack
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    RacksService.deleteRack(req.app.get('db'), req.user.id, req.params.rack_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = racksRouter;
