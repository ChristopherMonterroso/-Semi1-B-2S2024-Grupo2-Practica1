const express = require("express");
const {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistByUser,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlistController");

const router = express.Router();
router.post("/", createPlaylist);
router.get("/", getAllPlaylists);
router.get("/by_user", getPlaylistByUser);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist); 
router.delete("/:id", deletePlaylist);


module.exports = router;
