const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Province = db.define('province', {

  code: {
    type: Sequelize.TEXT
  },
  nom: {
    type: Sequelize.TEXT
  }
});

Province.sync().then(() => {
  console.log('table Province created');
});
module.exports = Province;
