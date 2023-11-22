const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Candidat = db.define('candidat', {

    numero : {
        type : Sequelize.INTEGER
    },
    nom : {
        type : Sequelize.TEXT
    },
    parti : {
        type : Sequelize.TEXT
    },
    logo : {
        type : Sequelize.TEXT
    },
    photo : {
        type : Sequelize.TEXT
    }
});

Candidat.sync().then(() => {
  console.log('table candidat created');
});
module.exports = Candidat;
