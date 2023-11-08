const { Sequelize } = require('sequelize');

const db = require('../connexion');

const District = db.define('district', {

    code: {
        type: Sequelize.TEXT
    },

    id_region: {
        type: Sequelize.INTEGER
    },
    nom: {
        type: Sequelize.TEXT
    }
});

District.sync().then(() => {
    console.log('table District created');
});
module.exports = District;
