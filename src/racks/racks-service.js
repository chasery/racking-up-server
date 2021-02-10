const xss = require('xss');

const RacksService = {
  getUserRacks(db, userId) {
    return db.from('ru_racks').select('*').where('user_id', userId);
  },
  getById(db, userId, rackId) {
    return RacksService.getUserRacks(db, userId)
      .where('rack_id', rackId)
      .first();
  },
  insertRack(db, userId, newRack) {
    return db
      .insert(newRack)
      .into('ru_racks')
      .returning('*')
      .then(([rack]) => rack)
      .then((rack) => RacksService.getById(db, userId, rack.rack_id));
  },
  updateRack(db, id, updatedRack) {
    return db
      .select('*')
      .from('ru_racks')
      .where('rack_id', id)
      .first()
      .update(updatedRack);
  },
  serializeRack(rack) {
    return {
      rack_id: rack.rack_id,
      rack_name: xss(rack.rack_name),
      user_id: rack.user_id,
      created_at: new Date(rack.created_at),
    };
  },
};

module.exports = RacksService;
