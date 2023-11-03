const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Region = db.define('region', {

    id_province : {
        type : Sequelize.INTEGER
    },
    nom : {
        type : Sequelize.TEXT
    }
});

Region.sync().then(() => {
  console.log('table created');
});
module.exports = Region;
