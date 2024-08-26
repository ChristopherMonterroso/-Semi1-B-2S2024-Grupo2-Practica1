const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user");

const Playlist = sequelize.define("Playlist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cover: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  
});

module.exports = Playlist;