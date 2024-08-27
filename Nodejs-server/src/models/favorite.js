const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Song = require('./song');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
        model: User,
        key: 'id',
        },
    },
    id_song: {
        type: DataTypes.INTEGER,
        references: {
        model: Song,
        key: 'id',
        }
    },
});

Favorite.belongsTo(User, { through:Favorite, foreignKey: 'id_user' });
Favorite.belongsTo(Song, { through:Favorite, foreignKey: 'id_song' });


module.exports = Favorite;