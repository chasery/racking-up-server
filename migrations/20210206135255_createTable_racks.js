exports.up = function (knex) {
  return knex.schema.createTable('ru_racks', function (table) {
    table.increments('rack_id');
    table.string('rack_name', 255).notNullable();
    table.integer('user_id').unsigned().notNullable();
    table
      .foreign('user_id')
      .references('id')
      .inTable('ru_users')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ru_racks');
};
