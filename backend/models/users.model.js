const { DataTypes } = require('sequelize');
const sequelize = require('../db/MysqlDB.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Organization_Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Mobile_Number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Address : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  City : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  State : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Country : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Zip_Code : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  OTP : {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  OTP_Status :{
    type: DataTypes.STRING(255),
    defaultValue: 'Notverified'
  },
  Role: {
    type: DataTypes.STRING(255),
    defaultValue: 'Primaryadmin'
  },
  Status: {
    type: DataTypes.STRING(255),
    defaultValue: 'Inactive'
  },
  logo:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  header_theme : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sidemenu_theme : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  primary_theme : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Database_Name:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  PAN_Number:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  GST_Number:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  Product_Key:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  Product_Status:{
    type: DataTypes.STRING,
    defaultValue: 'Trial',
  },
  Expiry_Date:{
    type: DataTypes.DATE,
    allowNull: true,
  }
},
{ 
  timestamps: true,
});

const subusers = sequelize.define('subusers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  Organization_Name: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  Role: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'Inactive'
  }
},
{ 
  timestamps: true,
});

module.exports = {User, subusers};

