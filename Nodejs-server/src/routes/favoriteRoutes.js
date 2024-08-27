const express = require('express');
const router = express.Router();
const { addFavoriteSong, getFavoriteSongs, removeFavoriteSong } = require('../controllers/favoriteController');

router.post('/addFavorite', addFavoriteSong);
router.get('/:id_user/favorites/', getFavoriteSongs);
router.delete('/removeFavorite/:id_playlist/:id_song', removeFavoriteSong);

module.exports = router;