const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Province = db.define('province', {
    nom : {
        type : Sequelize.TEXT
    }
});

Province.sync().then(() => {
  console.log('table created');
});
module.exports = Province;
