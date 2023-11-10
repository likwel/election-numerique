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
    },
    id_fokontany: {
        type : Sequelize.INTEGER
    }
});

Electeur.sync().then(() => {
  console.log('table Electeur created');
});
module.exports = Electeur;
