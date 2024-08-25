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

// Modelo para Canciones
/*const Cancion = sequelize.define('Cancion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fotografia: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  duracion: {
    type: DataTypes.TIME,
    allowNull: false
  },
  artista: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  archivoMp3: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Modelo para Playlists
const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fondoPortada: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

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