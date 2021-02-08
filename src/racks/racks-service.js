const xss = require('xss');

const RacksService = {
  getUserRacks(db, userId) {
    return db.from('ru_racks').select('*').where('user_id', userId);
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
