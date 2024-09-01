// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db').connectDB;
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const playlistSongsRoutes = require('./routes/playlistSongsRoutes');
const FavoriteRoutes = require('./routes/favoriteRoutes');
const { sequelize } = require('./config/db');


const app = express();
app.use(express.json()); 
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/user/playlist', playlistRoutes);
app.use('/api/user/playlist', playlistSongsRoutes);
app.use('/api/user/favorite', FavoriteRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the music app');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();