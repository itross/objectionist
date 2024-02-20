'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (t) => {
    t.increments('id');
    t.string('email');
    t.string('password');
    t.string('firstName');
    t.string('lastName');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
