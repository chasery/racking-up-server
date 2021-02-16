const xss = require('xss');

const RackItemsService = {
  getRackItemById(db, itemId) {
    return db
      .from('ru_rack_items')
      .select('*')
      .where({ item_id: itemId })
      .first();
  },
  insertRackItem(db, newRackItem) {
    return db
      .insert(newRackItem)
      .into('ru_rack_items')
      .returning('*')
      .then(([rackItem]) => rackItem)
      .then((rackItem) =>
        RackItemsService.getRackItemById(db, rackItem.item_id)
      );
  },
  updateRackItem(db, userId, itemId, updatedRackItem) {
    return db
      .from('ru_rack_items')
      .select('*')
      .where({ item_id: itemId, user_id: userId })
      .first()
      .update(updatedRackItem);
  },
  serializeRackItem(item) {
    return {
      item_id: item.item_id,
      item_name: xss(item.item_name),
      item_price: parseFloat(item.item_price), // PG has a default return of type string for 64-bit integers
      item_url: xss(item.item_url),
      user_id: item.user_id,
      rack_id: item.rack_id,
      created_at: new Date(item.created_at),
    };
  },
};

module.exports = RackItemsService;
