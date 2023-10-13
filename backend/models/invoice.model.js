const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/MysqlDB')
const moment = require('moment-timezone');
const dotenv = require('dotenv');
dotenv.config();

  const Invoices = sequelize.define( 'Invoices',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Invoice_ID: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      Customer_Name: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      Address: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      City: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      State: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      Zip_Code: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      Payment_Method: {
        type: DataTypes.STRING,
        defaultValue: 'Cash',
      },
      Customer_Mobilenumber: {
        type: DataTypes.STRING,
        defaultValue: '-',
      },
      Total_Quantity: DataTypes.INTEGER,
      Total_Amount: DataTypes.INTEGER,
      Invoice_Date: {
        type: DataTypes.DATE,
        defaultValue: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
      },
      Paid_Status: {
        type: DataTypes.STRING,
        defaultValue: 'Unpaid',
      }
      
    },
    {
      timestamps: true,
    
    }
  );


  // Define the InvoicesMaster model
  const InvoicesMaster = sequelize.define(
    'InvoicesMaster',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Invoice_ID: {
        type: DataTypes.INTEGER,
      },
      Item_Code: DataTypes.STRING,
      Item_Name: DataTypes.STRING,
      Item_Category: DataTypes.STRING,
      Sale_Price: DataTypes.FLOAT,
      Quantity: DataTypes.INTEGER,
      Tax_Status : DataTypes.STRING,
      Tax_Rate: DataTypes.INTEGER,
      Discount: DataTypes.FLOAT,
      Amount: DataTypes.FLOAT,
    },
    {
      timestamps: true,
    
    }
  );


module.exports = { Invoices, InvoicesMaster };
