const RacksService = require('../racks/racks-service');

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

module.exports = {
  checkRackExists,
};
