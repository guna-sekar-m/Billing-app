const sequelize = require("../db/MysqlDB.js");
const { QueryTypes } = require('sequelize');
const resetAutoIncrement = async (tableName) => {
    const query = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1`;
  
    try {
      await sequelize(query,{ type: QueryTypes.RAW });
      console.log(`Auto-increment reset for table ${tableName}`);
    } catch (error) {
      console.error(`Error resetting auto-increment for table ${tableName}:`, error);
    }
  };

  module.exports = {resetAutoIncrement};