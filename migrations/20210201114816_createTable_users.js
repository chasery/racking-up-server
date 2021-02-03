exports.up = function (knex) {
  return knex.schema.createTable('ru_users', function (table) {
    table.increments('id');
    table.string('email', 255).unique().notNullable();
    table.string('password', 72).notNullable();
    table.string('name', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ru_users');
};
