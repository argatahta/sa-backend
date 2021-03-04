/**
 * Shifts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    startTime: {
      type: 'string',
      required: true,
    },
    endTime: {
      type: 'string',
      required: true,
    }
  },
};

