exports.up = function (knex) {
  return knex.schema.createTable('ru_rack_items', function (table) {
    table.increments('item_id');
    table.string('item_name', 255).notNullable();
    table.decimal('item_price', 14, 2).notNullable();
    table.string('item_url', 1000);
    table.integer('user_id').unsigned().notNullable();
    table
      .foreign('user_id')
      .references('id')
      .inTable('ru_users')
      .onDelete('CASCADE');
    table.integer('rack_id').unsigned().notNullable();
    table
      .foreign('rack_id')
      .references('rack_id')
      .inTable('ru_racks')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ru_rack_items');
};
