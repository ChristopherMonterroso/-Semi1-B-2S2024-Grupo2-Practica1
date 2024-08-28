from sqlalchemy import Column, Integer, String, Date, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from config.db import Base

# Define el modelo User
class User(Base):
    __tablename__ = 'Users'  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    lastName = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    birthdate = Column(Date, nullable=False)
    profilePhoto = Column(String(255), nullable=False)
    rol = Column(Enum('Admin', 'Sub'), nullable=False)
    signUpDate = Column(DateTime, default=datetime.utcnow)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    favorites = relationship("Favorite", back_populates="user")
    playlist = relationship('Playlist', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'lastName': self.lastName,
            'email': self.email,
            'birthdate': self.birthdate.strftime('%Y-%m-%d'),
            'profilePhoto': self.profilePhoto,
            'rol': self.rol,
            'signUpDate': self.signUpDate.strftime('%Y-%m-%d %H:%M:%S'),
            'createdAt': self.signUpDate.strftime('%Y-%m-%d %H:%M:%S'),
            'updatedAt': self.signUpDate.strftime('%Y-%m-%d %H:%M:%S')
        }