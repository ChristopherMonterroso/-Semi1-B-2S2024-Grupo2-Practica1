const express = require('express');
const { addPlaylistSong, getSongsByPlaylist, deletePlaylistSong } = require('../controllers/playlistSongsController');
const router = express.Router();

router.post('/addSong', addPlaylistSong);
router.delete('/deleteSong/:id_playlist/:id_song', deletePlaylistSong);
router.get('/:id_playlist/getSongs', getSongsByPlaylist);



module.exports = router;