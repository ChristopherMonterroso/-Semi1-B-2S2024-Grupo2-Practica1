const express = require('express');
const router = express.Router();
const { addFavorite, getFavoriteSongs, removeFavoriteSong } = require('../controllers/favoriteController');

router.post('/addFavorite', addFavorite);
router.get('/:id_user/favorites/', getFavoriteSongs);
router.delete('/removeFavorite/:id_playlist/:id_song', removeFavoriteSong);

module.exports = router;