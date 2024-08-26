// controllers/playlistController.js
const AWS = require("aws-sdk");
const multer = require("multer");
const Playlist = require("../models/playlist"); // Asegúrate de importar tu modelo de Playlist

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() }).single("cover");

// Crear una nueva playlist
const createPlaylist = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading file", error: err, status: false });
        }
        try {
            const { name, description, id_user } = req.body;

            if (!name || !id_user || !req.file) {
                return res.status(400).json({ message: "All fields are required", status: false });
            }
            const existingPlaylist = await Playlist.findOne({ where: { name } });
            if (existingPlaylist) {
                return res.status(400).json({ message: "Playlist already exists", status: false });
            }
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: `Fotos/CPL_${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };


            const data = await s3.upload(uploadParams).promise();

            const playlist = await Playlist.create({
                name,
                description,
                cover: data.Location,
                id_user,
            });
            res.status(201).json({playlist,message:"playlist created succesfully", status: true} );
        } catch (error) {
            res.status(500).json({ error: error.message, status: false });
        }
    }
)};

// Obtener todas las playlists
const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.findAll();
    res.status(200).json({playlists, status: true});
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

// Obtener una playlist por ID
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByPk(id);
    if (playlist) {
      res.status(200).json({ playlist, status: true });
    } else {
      res.status(404).json({ message: "Playlist not found", status: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

const getPlaylistByUser = async (req, res) => {
  try {
    const { id_user } = req.query;
    const playlist = await Playlist.findAll({ where: { id_user } });
    if (playlist) {
      res.status(200).json({ playlist, status: true });
    } else {
      res.status(404).json({ message: "Playlist not found", status: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

// Actualizar una playlist
const updatePlaylist = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: err, status: false });
    }
    try{
      const { id } = req.params;
      const { name, description } = req.body;
      const updateData = {}
      if (name) updateData.name = name;
      if (description) updateData.description = description;

      const playlistExists = await Playlist.findByPk(id);
      if (!playlistExists) {
        return res.status(404).json({ message: "Playlist not found", status: false });
      }
      if (req.file) {
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `Fotos/CPL_${Date.now()}_${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const data = await s3.upload(uploadParams).promise();
        updateData.cover = data.Location;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data provided", status: false });
      }
      await Playlist.update(updateData, { where: { id } });
      res.status(200).json({ message: "Playlist updated successfully", status: true});

    } catch (error) {
      res.status(500).json({ error: error.message, status: false });
    }
  });
};

// Eliminar una playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Playlist.destroy({ where: { id } });
    console.log(deleted)
    if (deleted) {
      res.status(200).json({ message: "Playlist deleted", status: true});
    } else {
      res.status(404).json({ message: "Playlist not found", status: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  getPlaylistByUser,
};
