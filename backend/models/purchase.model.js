const { DataTypes, Sequelize } = require('sequelize');
const sequelize =require('../db/MysqlDB.js');

const Purchase = sequelize.define('Purchase', {
  Invoice_Number: {
    type: DataTypes.STRING,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    Item_Code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HSN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Brand_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Purchase_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Tax_Rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Purchase_date : {
      type : DataTypes.DATE,
      allowNull: false,
    },
    Purchase_Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    
  }, {
    timestamps: true,
  
  });

  
  module.exports = {Purchase};