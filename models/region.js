const { Sequelize } = require('sequelize');

const db = require('../connexion');

const Region = db.define('region', {

    code: {
        type: Sequelize.TEXT
    },

    id_province: {
        type: Sequelize.INTEGER
    },
    nom: {
        type: Sequelize.TEXT
    }
});

Region.sync().then(() => {
    console.log('table Region created');
});
module.exports = Region;
