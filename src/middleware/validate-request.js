const RacksService = require('../racks/racks-service');

async function validateRackRequest(req, res, next) {
  try {
    const rack = await RacksService.getUserRack(
      req.app.get('db'),
      req.params.rack_id
    );

    if (!rack)
      return res.status(404).json({
        error: `Rack doesn't exist`,
      });
    else if (rack.user_id !== req.user.id)
      return res.status(401).json({
        error: 'Unauthorized request',
      });

    res.rack = rack;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateRackRequest,
};
