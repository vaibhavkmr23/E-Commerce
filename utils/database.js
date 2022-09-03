const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', '23101995', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_project',
//     password: '23101995'
// });

// module.exports = pool.promise();