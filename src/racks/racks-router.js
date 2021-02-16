const express = require('express');
const path = require('path');
const RacksService = require('./racks-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { validateRackRequest } = require('../middleware/validate-request');

const racksRouter = express.Router();
const jsonBodyParser = express.json();

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

    RacksService.insertRack(req.app.get('db'), newRack)
      .then((rack) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${rack.rack_id}`))
          .json(RacksService.serializeRack(rack));
      })
      .catch(next);
  });

racksRouter
  .route('/:rackId')
  .all(requireAuth)
  .all(validateRackRequest)
  .get((req, res) => {
    res.json(RacksService.serializeRack(res.rack));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { id } = req.user;
    const { rackId } = req.params;
    const { rack_name } = req.body;
    const updatedRack = { rack_name };

    for (const [key, value] of Object.entries(updatedRack))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    RacksService.updateRack(req.app.get('db'), id, rackId, updatedRack)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.user;
    const { rackId } = req.params;

    RacksService.deleteRack(req.app.get('db'), id, rackId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = racksRouter;
