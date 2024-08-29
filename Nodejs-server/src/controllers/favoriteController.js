const Favorite = require('../models/favorite');
const Song = require('../models/song');
const User = require('../models/user');

const addFavorite = async (req, res) => {
    try {
        const { id_user, id_song } = req.body;

        if (!id_user || !id_song) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }
        const existingSong = await Song.findByPk(id_song);
        if (!existingSong) {
            return res.status(404).json({ message: "Song not found", status: false });
        }

        const existingRelation = await Favorite.findOne({ where: { id_user, id_song } });
        if (existingRelation) {
            return res.status(400).json({ message: "Song already exists on favorites", status: false });
        }

        const relation = await Favorite.create({
            id_user,
            id_song
        });
        res.status(201).json({ message: "Song added to favorites successfully", relation, status: true });
    } catch (error) {
        res.status(500).json({ message: "Error adding song to favorites", error, status: false });
    }
}

const getFavoriteSongs = async (req, res) => {
    try {
        const { id_user } = req.params;

        if (!id_user) {
            return res.status(400).json({ message: "User ID is required", status: false });
        }
        const songs = await Favorite.findAll({
            where: { id_user },
            include: Song
        });
    
        if (songs.length === 0) {
            return res.status(404).json({ message: "No favorite songs found", status: false });
        }

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorite songs", error, status: false });
    }
};
const removeFavoriteSong = async (req, res) => {
    try {
        const { id_user, id_song } = req.params;

        if (!id_user || !id_song) {
            return res.status(400).json({ message: "User ID and Song ID are required", status: false });
        }

        // Eliminar la relación correspondiente
        const deleted = await Favorite.destroy({
            where: { id_user, id_song }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Favorite not found", status: false });
        }
        res.status(200).json({ message: "Song removed from favorites successfully", status: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing song from favorites", error, status: false });
    }
};


module.exports = {
    addFavorite,
    getFavoriteSongs,
    removeFavoriteSong
};