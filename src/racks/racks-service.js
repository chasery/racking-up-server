const xss = require('xss');
const { serializeRackItem } = require('../rackItems/rackItems-service');

const RacksService = {
  getUserRacks(db, userId) {
    return (
      db
        .from('ru_racks AS racks')
        .select(
          'racks.rack_id',
          'racks.rack_name',
          'racks.user_id',
          'racks.created_at',
          'items.item_id',
          'items.item_name',
          'items.item_price',
          'items.item_url',
          'items.created_at AS item_created_at'
        )
        .leftJoin('ru_rack_items AS items', 'racks.rack_id', 'items.rack_id')
        // knex('users').orderBy(['email', { column: 'age', order: 'desc' }])
        .orderBy([
          { column: 'racks.rack_id', order: 'desc' },
          { column: 'item_id', order: 'asc' },
        ])
        .where('racks.user_id', userId)
        .then((rackItems) => {
          if (rackItems) {
            return RacksService.rackItemsReducer(rackItems);
          }
          return [];
        })
    );
  },
  getRackById(db, rackId) {
    return db
      .from('ru_racks AS racks')
      .select(
        'racks.rack_id',
        'racks.rack_name',
        'racks.user_id',
        'racks.created_at',
        'items.item_id',
        'items.item_name',
        'items.item_price',
        'items.item_url',
        'items.created_at AS item_created_at'
      )
      .leftJoin('ru_rack_items AS items', 'racks.rack_id', 'items.rack_id')
      .orderBy('item_id', 'asc')
      .where('racks.rack_id', rackId)
      .then((rackItems) => {
        if (rackItems) {
          const reducedRack = RacksService.rackItemsReducer(rackItems);
          return reducedRack[0];
        }
      });
  },
  insertRack(db, newRack) {
    return db
      .insert(newRack)
      .into('ru_racks')
      .returning('*')
      .then(([rack]) => rack)
      .then((rack) => RacksService.getRackById(db, rack.rack_id));
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
  rackItemsReducer(rackItems) {
    return rackItems
      .reduce((racks, item, i) => {
        // Organize rackItems with matching rack_id into arrays of rackItems
        if (!i || racks[racks.length - 1][0].rack_id !== item.rack_id) {
          return racks.concat([[item]]);
        }
        racks[racks.length - 1].push(item);
        return racks;
      }, [])
      .map((racks) => {
        // Reduce arrays of rackItem into formatted rack objects
        return racks.reduce((rack, item) => {
          const {
            rack_id,
            rack_name,
            user_id,
            created_at,
            item_created_at,
            ...theItem
          } = item;
          rack.rack_id = rack_id;
          rack.rack_name = rack_name;
          rack.user_id = user_id;
          rack.created_at = created_at;

          if (!rack.items) {
            rack.items = [];
          }

          if (item.item_id) {
            rack.items.push({ ...theItem, created_at: item_created_at });
          }
          return rack;
        }, {});
      });
  },
  serializeRack(rack) {
    if (rack.items) {
      rack.items = rack.items.map((item) => serializeRackItem(item));
    }
    return {
      rack_id: rack.rack_id,
      rack_name: xss(rack.rack_name),
      user_id: rack.user_id,
      created_at: new Date(rack.created_at),
      items: rack.items,
    };
  },
};

module.exports = RacksService;
