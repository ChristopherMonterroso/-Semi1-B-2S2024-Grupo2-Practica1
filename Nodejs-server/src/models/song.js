// Modelo para Canciones
const { DataTypes } = require('sequelize');
const{ sequelize } = require('../config/db'); // Asegúrate de configurar tu instancia de Sequelize

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  duration: {
    type: DataTypes.TIME,
    allowNull: false
  },
  artist: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mp3File: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Song