const RacksService = require('../racks/racks-service');
const RackItemsService = require('../rackItems/rackItems-service');

async function validateRackRequest(req, res, next) {
  try {
    const rack = await RacksService.getRackById(
      req.app.get('db'),
      req.params.rackId
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

async function validateRackItemRequest(req, res, next) {
  try {
    const rackItem = await RackItemsService.getRackItemById(
      req.app.get('db'),
      req.params.itemId
    );

    if (!rackItem)
      return res.status(404).json({
        error: `Rack item doesn't exist`,
      });
    else if (rackItem.user_id !== req.user.id)
      return res.status(401).json({
        error: 'Unauthorized request',
      });

    res.rackItem = rackItem;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateRackRequest,
  validateRackItemRequest,
};
