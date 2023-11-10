const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Fokontany = db.define('fokontany', {

    code: {
        type: Sequelize.TEXT
    },
    id_commune : {
        type : Sequelize.INTEGER
    },
    nom : {
        type : Sequelize.TEXT
    }
});

Fokontany.sync().then(() => {
  console.log('table Fokontany created');
});
module.exports = Fokontany;
