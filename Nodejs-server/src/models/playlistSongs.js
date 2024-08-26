const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Song = require("./song");
const Playlist = require("./playlist");

const PlaylistSongs = sequelize.define("playlistSongs", {
    id_playlist: {
      type: DataTypes.INTEGER,
      references: {
        model: Playlist, // Modelo al que hace referencia
        key: 'id',       // Clave en el modelo de referencia
      },
      allowNull: false,
    },
    id_song: {
      type: DataTypes.INTEGER,
      references: {
        model: Song, // Modelo al que hace referencia
        key: 'id',   // Clave en el modelo de referencia
      },
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id_playlist', 'id_song']
      }
    ]
  });

  Playlist.belongsToMany(Song, { through: PlaylistSongs, foreignKey: 'id_playlist' });
  Song.belongsToMany(Playlist, { through: PlaylistSongs, foreignKey: 'id_song' });
module.exports = PlaylistSongs;