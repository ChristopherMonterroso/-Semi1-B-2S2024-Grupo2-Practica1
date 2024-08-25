// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
// Configurar la conexión a la base de datos
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); 
  }
};

module.exports = { sequelize, connectDB };