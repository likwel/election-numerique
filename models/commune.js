const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Commune = db.define('commune', {

    code: {
        type: Sequelize.TEXT
    },

    id_district : {
        type : Sequelize.INTEGER
    },
    nom : {
        type : Sequelize.TEXT
    }
});

Commune.sync().then(() => {
  console.log('table Commune created');
});
module.exports = Commune;
