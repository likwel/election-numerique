const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Fokontany = db.define('fokontany', {

    name : {
        type : Sequelize.TEXT
    },
    commune : {
        type : Sequelize.TEXT
    }
});

Fokontany.sync().then(() => {
  console.log('table created');
});
module.exports = Fokontany;
