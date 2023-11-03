const { Sequelize } = require('sequelize');

const db = require('../connexion');

const District = db.define('district', {

    id_region : {
        type : Sequelize.INTEGER
    },
    libelle : {
        type : Sequelize.TEXT
    }
});

District.sync().then(() => {
  console.log('table created');
});
module.exports = District;
