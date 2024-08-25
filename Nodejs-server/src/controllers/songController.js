const AWS = require('aws-sdk');
const multer = require('multer');
const Song = require('../models/song');

// Configuración de AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configura Multer para manejar la carga de archivos
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'mp3File', maxCount: 1 }
]);

// Crear una nueva canción
const createSong = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading files", error: err });
    }

    try {
      const { name, duration, artist } = req.body;

      if (!name || !duration || !artist || !req.files['photo'] || !req.files['mp3File']) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Subir la foto a S3
      const photoUploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Fotos/${Date.now()}_${req.files['photo'][0].originalname}`,
        Body: req.files['photo'][0].buffer,
        ContentType: req.files['photo'][0].mimetype,
      };
      const photoData = await s3.upload(photoUploadParams).promise();

      // Subir el archivo MP3 a S3
      const mp3UploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Canciones/${Date.now()}_${req.files['mp3File'][0].originalname}`,
        Body: req.files['mp3File'][0].buffer,
        ContentType: req.files['mp3File'][0].mimetype,
      };
      const mp3Data = await s3.upload(mp3UploadParams).promise();

      // Crear la canción en la base de datos
      const song = await Song.create({
        name,
        duration,
        artist,
        photo: photoData.Location, // URL de la foto
        mp3File: mp3Data.Location  // URL del archivo MP3
      });

      res.status(201).json({ message: "Song created successfully", song, status: true });
    } catch (error) {
      res.status(500).json({ message: "Error creating song", error, status: false });
    }
  });
};

// Actualizar una canción
const updateSong = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading files", error: err });
    }

    try {
      const { id } = req.params;
      const { name, duration, artist } = req.body;

      const song = await Song.findByPk(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (duration) updateData.duration = duration;
      if (artist) updateData.artist = artist;

      // Subir una nueva foto si existe
      if (req.files['photo']) {
        const photoUploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `Fotos/${Date.now()}_${req.files['photo'][0].originalname}`,
          Body: req.files['photo'][0].buffer,
          ContentType: req.files['photo'][0].mimetype,
        };
        const photoData = await s3.upload(photoUploadParams).promise();
        updateData.photo = photoData.Location;
      }

      // Subir un nuevo archivo MP3 si existe
      if (req.files['mp3File']) {
        const mp3UploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `Mp3Files/${Date.now()}_${req.files['mp3File'][0].originalname}`,
          Body: req.files['mp3File'][0].buffer,
          ContentType: req.files['mp3File'][0].mimetype,
        };
        const mp3Data = await s3.upload(mp3UploadParams).promise();
        updateData.mp3File = mp3Data.Location;
      }

      // Actualiza la canción en la base de datos
      await Song.update(updateData, { where: { id } });
      res.status(200).json({ message: "Song updated successfully", status: true });
    } catch (error) {
      res.status(500).json({ message: "Error updating song", error, status: false });
    }
  });
};

// Obtener todas las canciones
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
};

// Obtener una canción por ID
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findByPk(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: "Error fetching song", error });
  }
};

// Eliminar una canción por ID
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findByPk(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    await Song.destroy({ where: { id } });
    res.status(200).json({ message: "Song deleted successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error, status: false });
  }
};

module.exports = {
  createSong,
  updateSong,
  getAllSongs,
  getSongById,
  deleteSong
};


