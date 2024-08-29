const PlayListSongs = require('../models/playlistSongs');
const Song = require('../models/song');
const Playlist = require('../models/playlist');
// Crear una nueva relación entre una canción y una playlist

const addPlaylistSong = async (req, res) => {
    try {
        const { id_playlist, id_song } = req.body;

        if (!id_playlist || !id_song) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }
        const existingPlaylist = await Playlist.findByPk(id_playlist);
        if (!existingPlaylist) {
            return res.status(404).json({ message: "Playlist not found", status: false });
        }
        const existingSong = await Song.findByPk(id_song);
        if (!existingSong) {
            return res.status(404).json({ message: "Song not found", status: false });
        }

        const existingRelation = await PlayListSongs.findOne({ where: { id_playlist, id_song } });
        if (existingRelation) {
            return res.status(400).json({ message: "Song already exists on this playlist", status: false });
        }

        const relation = await PlayListSongs.create({
            id_playlist,
            id_song
        });
        res.status(201).json({ message: "Song added successfully", relation, status: true });
    } catch (error) {
        res.status(500).json({ message: "Error adding song", error, status: false });
    }
}

// Obtener todas las canciones de la playlist de un usuario
const getSongsByPlaylist = async (req, res) => {
    try {
        const { id_playlist } = req.params;

        if (!id_playlist) {
            return res.status(400).json({ message: "Playlist ID is required", status: false });
        }

        const playlist = await Playlist.findByPk(id_playlist, {
            include: {
                model: Song,
                through: { attributes: [] } // Excluye las columnas de la tabla de unión
            }
        });

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found", status: false });
        }

        if (playlist.Songs.length === 0) {
            return res.status(404).json({ message: "This playlist doesn't have any songs", status: false });
        }

        // Retornar las canciones asociadas a la playlist
        res.status(200).json(playlist.Songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs", error, status: false });
    }
}

// Eliminar una canción de la playlist
const deletePlaylistSong = async (req, res) => {
    try {
        const { id_playlist, id_song } = req.params;

        if (!id_playlist || !id_song) {
            return res.status(400).json({ message: "Playlist ID and Song ID are required", status: false });
        }

        const deleted = await  PlayListSongs.destroy({
            where: { id_playlist: id_playlist, id_song: id_song }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Song not found in the playlist", status: false });
        }

        res.status(200).json({ message: "Song was successfully removed from the playlist", status: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting song from playlist", error, status: false });
    }
};
module.exports = {
    addPlaylistSong,
    getSongsByPlaylist,
    deletePlaylistSong
};