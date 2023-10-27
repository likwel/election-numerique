const { Sequelize } = require('sequelize');

require('dotenv').config();

const pass = process.env.DB_PASS
const database = process.env.DB_DATABASE
const username = process.env.DB_USER
const host = process.env.DB_HOST
let url = process.env.DB_URI;

module.exports = new Sequelize(database, username, pass, {
    host: host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});
