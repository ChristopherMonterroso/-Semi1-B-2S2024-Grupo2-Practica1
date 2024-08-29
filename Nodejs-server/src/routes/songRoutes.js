const express = require("express");
const {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  getSongByName,
} = require("../controllers/songController");
const router = express.Router();

router.post("/", createSong);
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.get("/byName/:name", getSongByName);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

module.exports = router;
