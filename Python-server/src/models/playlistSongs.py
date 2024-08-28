from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base

class PlaylistSongs(Base):
    __tablename__ = 'playlistSongs'

    id_playlist = Column(Integer, ForeignKey('Playlists.id'), primary_key=True)
    id_song = Column(Integer, ForeignKey('Songs.id'), primary_key=True)

    #playlists = relationship('Playlist', back_populates='playlistsongs')

    def to_dict(self):
        return {
            'id_playlist': self.id_playlist,
            'id_song': self.id_song
        }