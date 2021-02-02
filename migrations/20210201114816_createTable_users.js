exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("email", 255).notNullable();
    table.string("password", 72).notNullable();
    table.string("name", 255);
    table.datetime("created_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
