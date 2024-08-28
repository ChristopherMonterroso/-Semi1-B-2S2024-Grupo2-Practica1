from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
from models.user import User
from models.song import Song

class Favorite(Base):
    __tablename__ = 'Favorites'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer, ForeignKey('Users.id'), nullable=False)
    id_song = Column(Integer, ForeignKey('Songs.id'), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="favorites")
    song = relationship("Song", back_populates="favorites")

    def to_dict(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
            'id_song': self.id_song,
            'user': self.user.to_dict() if self.user else None,
            'song': self.song.to_dict() if self.song else None
        }