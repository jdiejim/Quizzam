
exports.up = (knex) => {
  return knex.schema.createTable('room', (table) => {
    table.string('id', 4).primary();
    table.integer('quiz_id').unsigned();
    table.foreign('quiz_id').references('quiz.id').onDelete('CASCADE');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('room');
};
