from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
from datetime import datetime

class Playlist(Base):
    __tablename__ = 'Playlists'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    cover = Column(String(255), nullable=False)
    createDate = Column(DateTime, default=datetime.now)
    id_user = Column(Integer, ForeignKey('Users.id'))

    # Relación
    user = relationship("User", back_populates="playlist")
    #playlistsongs = relationship("playlistSongs", back_populates="playlist")
    # songs = relationship('Song', secondary='playlistSongs', back_populates='playlists')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "cover": self.cover,
            "createDate": self.createDate.isoformat(),
            "id_user": self.id_user,
        }
