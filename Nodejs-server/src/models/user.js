const { DataTypes } = require('sequelize');
const{ sequelize } = require('../config/db'); // Asegúrate de configurar tu instancia de Sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  profilePhoto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('Admin', 'Sub'),
    allowNull: false
  },
  signUpDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = User;


// Modelo para Playlists

/*
// Modelo para Canciones_Playlists (Relación Muchos a Muchos)
const CancionPlaylist = sequelize.define('CancionPlaylist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playlistId: {
    type: DataTypes.INTEGER,
    references: {
      model: Playlist,
      key: 'id'
    }
  },
  cancionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cancion,
      key: 'id'
    }
  }
});

// Modelo para Favoritos
const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  cancionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cancion,
      key: 'id'
    }
  }
});

// Modelo para Estadísticas
const Estadistica = sequelize.define('Estadistica', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  cancionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cancion,
      key: 'id'
    }
  },
  fechaReproduccion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});*/