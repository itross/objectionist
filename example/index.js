'use strict';

const path = require('path');
const { Model } = require('objection');
const Knex = require('knex');
const defineModel = require('..');

const defaultDbConfig = {
  client: 'sqlite3',
  migrations: { tableName: 'knex_migrations', },
  connection: {
    filename: path.join(process.cwd(), 'objectionist.db')
  },
  useNullAsDefault: true
};

async function main() {
  console.log(`Knex initialization - config: ${JSON.stringify(defaultDbConfig, null, 2)}`);
  const knex = Knex(defaultDbConfig);
  // const knex = Knex(defaultConfig);

  console.log('**************************');
  console.log('DB schema migration');
  await knex.migrate.rollback();
  await knex.migrate.latest();
  console.log('**************************');

  console.log('binding knex instance to Model');
  Model.knex(knex);

  const User = defineModel('users', {
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        password: { type: 'string' }
      }
    }
  }, {
    activeMethods: {
      findByEmail(email) {
        return this.query().select().where('email', '=', email);
      }
    },
    instanceMethods: {
      fullName() {
        console.log('****** fullName() ******');
        return `${this.firstName} ${this.lastName}`;
      }
    }

  });
  await User.create({
    email: 'frank.zappa@test.com',
    password: 'supersupersecret',
    firstName: 'Frank',
    lastName: 'Zappa'
  });
  await User.create({
    email: 'warren.cuccurullo@test.com',
    password: 'supersecret',
    firstName: 'Warren',
    lastName: 'Cuccurullo'
  });

  const users = await User.findAll();
  console.log(`USERS: ${JSON.stringify(users, null, 2)}`);
  users.forEach((u) => {
    console.log(u.fullName());
  });

  const frank = await User.findOne(1);
  console.log(`user frank: ${JSON.stringify(frank, null, 2)}`);

  const warren = await User.findByEmail('warren.cuccurullo@test.com');
  console.log(`where name=Warren: ${JSON.stringify(warren, null, 2)}`);
}

main();
