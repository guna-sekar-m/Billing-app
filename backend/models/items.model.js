const { DataTypes, Sequelize } =require('sequelize');
const sequelize =require('../db/MysqlDB.js');

 
  const Item = sequelize.define('Items', {
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
    Brand_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HSN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Purchase_Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Sale_Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Item_Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Tax_Rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Tax_Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Item_Status: {
      type: DataTypes.STRING,
      defaultValue: 'Active',
    },
    Stock_added_date : {
      type : DataTypes.DATE,
      allowNull: true,
    }
    
  }, {
    freezeTableName: true,
    timestamps: true,
   
  });

module.exports = {Item};
