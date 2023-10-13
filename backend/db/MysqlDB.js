const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize('bill_soft', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate().then(() => { console.log('Database connected') }).catch((error) => {
  console.error('Error connecting to the database:', error);
});

module.exports = sequelize;
