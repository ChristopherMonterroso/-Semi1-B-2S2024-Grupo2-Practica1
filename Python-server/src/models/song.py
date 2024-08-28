from sqlalchemy import Column, Integer, String, DateTime, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from config.db import Base

# Define el modelo Song
class Song(Base):
    __tablename__ = 'Songs'  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    photo = Column(String(255), nullable=False)
    duration = Column(Time, nullable=False)
    artist = Column(String(100), nullable=False)
    mp3File = Column(String(255), nullable=False)
    creationDate = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    favorites = relationship("Favorite", back_populates="song")
    #playlists = relationship('Playlist', secondary='playlistSongs', back_populates='songs')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'photo': self.photo,
            'duration': str(self.duration),
            'artist': self.artist,
            'mp3File': self.mp3File,
            'creationDate': self.creationDate.strftime('%Y-%m-%d %H:%M:%S'),
            'updatedAt': self.creationDate.strftime('%Y-%m-%d %H:%M:%S')
        }