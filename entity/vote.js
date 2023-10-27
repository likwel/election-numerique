const { Sequelize } = require('sequelize');

const db = require('../connexion');


const Vote = db.define('vote', {

    electeur_id : {
        type : Sequelize.INTEGER
    },
    candidat_id : {
        type : Sequelize.INTEGER
    },
    vote : {
        type : Sequelize.BOOLEAN
    }
});

Vote.sync().then(() => {
  console.log('table created');
});
module.exports = Vote;
