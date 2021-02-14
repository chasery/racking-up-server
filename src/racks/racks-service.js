const xss = require('xss');

const RacksService = {
  getUserRacks(db, userId) {
    return db.from('ru_racks').select('*').where('user_id', userId);
  },
  getUserRack(db, rackId) {
    return db.from('ru_racks').select('*').where({ rack_id: rackId }).first();
  },
  insertRack(db, newRack) {
    return db
      .insert(newRack)
      .into('ru_racks')
      .returning('*')
      .then(([rack]) => rack)
      .then((rack) => RacksService.getUserRack(db, rack.rack_id));
  },
  updateRack(db, userId, rackId, updatedRack) {
    return db
      .from('ru_racks')
      .select('*')
      .where({ rack_id: rackId, user_id: userId })
      .first()
      .update(updatedRack);
  },
  deleteRack(db, userId, rackId) {
    return db
      .from('ru_racks')
      .select('*')
      .where({ rack_id: rackId, user_id: userId })
      .first()
      .delete();
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
