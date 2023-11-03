const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Commune = db.define('commune', {

    id_district : {
        type : Sequelize.INTEGER
    },
    nom : {
        type : Sequelize.TEXT
    }
});

Commune.sync().then(() => {
  console.log('table created');
});
module.exports = Commune;
