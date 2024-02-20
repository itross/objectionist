'use strict';

const { Model } = require('objection');

function defineModel(tableName, modelConfig = {}, mix = {
  activeMethods: {},
  instanceMethods: {}
}) {
  class Internal extends Model {
    static tableName = tableName;
    static relationMappings = modelConfig.relationMappings || {};
    static jsonSchema = modelConfig.schema || {};

    static async create(data) {
      await this.query().insert(data);
    }

    static async findAll() {
      return this.query().select();
    }

    static async findOne(id) {
      return this.query().findById(id);
    }
  }

  Object.entries(mix.activeMethods).forEach(([k, v]) => Internal[k] = v);
  Object.entries(mix.instanceMethods).forEach(([k, v]) => Internal.prototype[k] = v);

  return Internal;
}

module.exports = defineModel;
