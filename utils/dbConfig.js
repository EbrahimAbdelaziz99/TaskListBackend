if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,

    {   
        host: process.env.HOST,
        dialect: 'mysql'
    }
);


module.exports = sequelize;