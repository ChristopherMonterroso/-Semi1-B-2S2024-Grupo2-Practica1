import os
from flask import request, jsonify
from sqlalchemy.orm import Session
from werkzeug.utils import secure_filename
from config.db import get_db
from models.playlist import Playlist
from models.playlistSongs import PlaylistSongs
from models.song import Song
from boto3 import client
from dotenv import load_dotenv
from io import BytesIO
from datetime import datetime

load_dotenv()

def addPlaylistSong():
    try:
        # Obtener los datos del formulario
        id_playlist = request.form.get('id_playlist')
        id_song = request.form.get('id_song')

        if not id_playlist or not id_song:
            return jsonify({"message": "All fields are required", "status": False}), 400

        db: Session = next(get_db())

        # Verificar si la playlist existe
        existing_playlist = db.query(Playlist).filter_by(id=id_playlist).first()
        if not existing_playlist:
            return jsonify({"message": "Playlist not found", "status": False}), 404

        # Verificar si la canción existe
        existing_song = db.query(Song).filter_by(id=id_song).first()
        if not existing_song:
            return jsonify({"message": "Song not found", "status": False}), 404

        # Verificar si la relación ya existe
        existing_relation = db.query(PlaylistSongs).filter_by(id_playlist=id_playlist, id_song=id_song).first()
        if existing_relation:
            return jsonify({"message": "Song already exists on this playlist", "status": False}), 400

        # Crear la relación en la base de datos
        new_relation = PlaylistSongs(id_playlist=id_playlist, id_song=id_song)
        db.add(new_relation)
        db.commit()

        return jsonify({"message": "Song added successfully", "relation": new_relation.to_dict(), "status": True}), 201

    except Exception as error:
        return jsonify({"message": "Error adding song", "error": str(error), "status": False}), 500

def getSongsByPlaylist(id_playlist):
    try:
        if not id_playlist:
            return jsonify({"message": "Playlist ID is required", "status": False}), 400

        db: Session = next(get_db())

        # Consultar la playlist con las canciones asociadas
        playlist = db.query(Playlist).filter_by(id=id_playlist).first()

        if not playlist:
            return jsonify({"message": "Playlist not found", "status": False}), 404

        # Obtener las canciones asociadas a la playlist
        songs = db.query(Song).join(PlaylistSongs).filter(PlaylistSongs.id_playlist == id_playlist).all()

        if not songs:
            return jsonify({"message": "This playlist doesn't have any songs", "status": False}), 404

        # Retornar las canciones asociadas a la playlist
        songs_dict = [song.to_dict() for song in songs]
        return jsonify({"songs": songs_dict, "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error fetching songs", "error": str(error), "status": False}), 500

def deletePlaylistSong(id_playlist, id_song):
    try:
        if not id_playlist or not id_song:
            return jsonify({"message": "Playlist ID and Song ID are required", "status": False}), 400

        db: Session = next(get_db())

        # Eliminar la relación entre la playlist y la canción
        deleted = db.query(PlaylistSongs).filter_by(id_playlist=id_playlist, id_song=id_song).delete()

        if not deleted:
            return jsonify({"message": "Song not found in the playlist", "status": False}), 404

        db.commit()

        return jsonify({"message": "Song was successfully removed from the playlist", "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error deleting song from playlist", "error": str(error), "status": False}), 500