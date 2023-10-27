const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Electeur = db.define('electeur', {

    identite : {
        type : Sequelize.TEXT
    },
    nom : {
        type : Sequelize.TEXT
    },
    photo : {
        type : Sequelize.TEXT
    },
    photo2 : {
        type : Sequelize.TEXT
    }
});

Electeur.sync().then(() => {
  console.log('table created');
});
module.exports = Electeur;
