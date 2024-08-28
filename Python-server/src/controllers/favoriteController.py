from flask import request, jsonify
from config.db import engine, Base, get_db
from models.song import Song
from models.user import User
from models.favorite import Favorite
from sqlalchemy.orm import Session

def addFavorite():
    try:
        # Obtener datos del formulario
        id_user = request.form.get('id_user')
        id_song = request.form.get('id_song')

        if not id_user or not id_song:
            return jsonify({"message": "All fields are required", "status": False}), 400

        # Obtener la sesión de base de datos
        db: Session = next(get_db())

        # Verificar si la canción existe
        existing_song = db.query(Song).filter(Song.id == id_song).first()
        if not existing_song:
            return jsonify({"message": "Song not found", "status": False}), 404

        # Verificar si la relación ya existe
        existing_relation = db.query(Favorite).filter(Favorite.id_user == id_user, Favorite.id_song == id_song).first()
        if existing_relation:
            return jsonify({"message": "Song already exists on favorites", "status": False}), 400

        # Crear la nueva relación de favorito
        new_favorite = Favorite(id_user=id_user, id_song=id_song)
        db.add(new_favorite)
        db.commit()

        return jsonify({"message": "Song added to favorites successfully", "relation": new_favorite.to_dict(), "status": True}), 201

    except Exception as error:
        return jsonify({"message": "Error adding song to favorites", "error": str(error), "status": False}), 500

def getFavoriteSongs(id_user):
    try:
        # Obtener la sesión de base de datos
        db: Session = next(get_db())

        if not id_user:
            return jsonify({"message": "User ID is required", "status": False}), 400

        # Buscar el usuario y sus canciones favoritas
        user = db.query(User).filter(User.id == id_user).first()

        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        # Obtener las canciones favoritas del usuario
        favorite_songs = db.query(Song).join(
            Favorite, Song.id == Favorite.id_song
        ).filter(Favorite.id_user == id_user).all()

        if not favorite_songs:
            return jsonify({"message": "No favorite songs found", "status": False}), 404

        # Convertir las canciones favoritas a diccionario
        favorite_songs_dict = [song.to_dict() for song in favorite_songs]

        return jsonify(favorite_songs_dict), 200

    except Exception as error:
        return jsonify({"message": "Error fetching favorite songs", "error": str(error), "status": False}), 500

def removeFavoriteSong(id_playlist, id_song):
    try:
        # Obtener la sesión de base de datos
        db: Session = next(get_db())

        if not id_playlist or not id_song:
            return jsonify({"message": "Playlist ID and Song ID are required", "status": False}), 400

        # Eliminar la relación correspondiente
        deleted = db.query(Favorite).filter_by(id_user=id_playlist, id_song=id_song).delete()

        if not deleted:
            return jsonify({"message": "Favorite not found", "status": False}), 404
        
        db.commit()

        return jsonify({"message": "Song removed from favorites successfully", "status": True}), 200
    except Exception as error:
        return jsonify({"message": "Error removing song from favorites", "error": str(error), "status": False}), 500