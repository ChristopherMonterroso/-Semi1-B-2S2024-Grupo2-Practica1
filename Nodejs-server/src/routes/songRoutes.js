const express = require("express");
const {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
} = require("../controllers/songController");
const router = express.Router();

router.post("/", createSong);
router.get("/", getAllSongs);
router.get("/:id", getSongById);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

module.exports = router;
