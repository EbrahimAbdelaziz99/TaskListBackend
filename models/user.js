const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = require('../utils/dbCongig');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    admin:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false,
    },

})

module.exports = User;