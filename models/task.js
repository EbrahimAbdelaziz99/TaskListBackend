const {  DataTypes ,Sequelize  } = require('sequelize');

const sequelize = require('../utils/dbCongig');

const Task = sequelize.define('Task',{
    id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    username:{
      type: DataTypes.STRING,
      allowNull:false,
    },
},{timestamps : true, defaultValue:DataTypes.DATE})

module.exports = Task;