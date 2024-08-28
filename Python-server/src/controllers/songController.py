import os
from io import BytesIO
import bcrypt
import boto3
from flask import request, jsonify
from config.db import engine, Base, get_db
from models.song import Song
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from datetime import datetime
import tempfile
import uuid

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

def createSong():
    try:
        # Obtener los datos del formulario
        name = request.form.get('name')
        duration = request.form.get('duration')
        artist = request.form.get('artist')
        photo = request.files.get('photo')
        mp3_file = request.files.get('mp3File')

        # Validar que todos los campos estén presentes
        if not all([name, duration, artist, photo, mp3_file]):
            return jsonify({"message": "All fields are required", "status": False}), 400

        db: Session = next(get_db())

        # Verificar si la canción ya existe
        existing_song = db.query(Song).filter_by(name=name).first()
        if existing_song:
            return jsonify({"message": "Song already exists", "status": False}), 400

        # Subir la foto a S3
        photo_filename = f"Fotos/SC_{datetime.now().timestamp()}_{secure_filename(photo.filename)}"
        s3.upload_fileobj(
            Fileobj=BytesIO(photo.read()),
            Bucket=os.getenv('BUCKET_NAME'),
            Key=photo_filename,
            ExtraArgs={"ContentType": photo.content_type}
        )
        photo_url = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{photo_filename}"

        # Subir el archivo MP3 a S3
        mp3_filename = f"Canciones/{datetime.now().timestamp()}_{secure_filename(mp3_file.filename)}"
        s3.upload_fileobj(
            Fileobj=BytesIO(mp3_file.read()),
            Bucket=os.getenv('BUCKET_NAME'),
            Key=mp3_filename,
            ExtraArgs={"ContentType": mp3_file.content_type}
        )
        mp3_url = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{mp3_filename}"

        # Crear la canción en la base de datos
        new_song = Song(
            name=name,
            duration=duration,
            artist=artist,
            photo=photo_url,
            mp3File=mp3_url
        )
        db.add(new_song)
        db.commit()

        return jsonify({"message": "Song created successfully", "song": new_song.to_dict(), "status": True}), 201

    except Exception as error:
        return jsonify({"message": "Error creating song", "error": str(error), "status": False}), 500

def updateSong(id):
    try:
        db: Session = next(get_db())
        song = db.query(Song).filter_by(id=id).first()
        if not song:
            return jsonify({"message": "Song not found", "status": False}), 404

        name = request.form.get('name')
        duration = request.form.get('duration')
        artist = request.form.get('artist')
        files = request.files

        update_data = {}
        if name:
            update_data['name'] = name
        if duration:
            update_data['duration'] = duration
        if artist:
            update_data['artist'] = artist

        # Subir una nueva foto si existe
        if 'photo' in files:
            photo_file = files['photo']
            photo_filename = secure_filename(photo_file.filename)
            photo_key = f"Fotos/{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{photo_filename}"
            s3.upload_fileobj(
                photo_file,
                os.getenv('BUCKET_NAME'),
                photo_key,
                ExtraArgs={"ContentType": photo_file.content_type}
            )
            update_data['photo'] = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{photo_key}"

        # Subir un nuevo archivo MP3 si existe
        if 'mp3File' in files:
            mp3_file = files['mp3File']
            mp3_filename = secure_filename(mp3_file.filename)
            mp3_key = f"Canciones/{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{mp3_filename}"
            s3.upload_fileobj(
                mp3_file,
                os.getenv('BUCKET_NAME'),
                mp3_key,
                ExtraArgs={"ContentType": mp3_file.content_type}
            )
            update_data['mp3File'] = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{mp3_key}"

        # Actualiza la canción en la base de datos
        db.query(Song).filter_by(id=id).update(update_data)
        song.updatedAt = datetime.utcnow()
        db.commit()

        return jsonify({"message": "Song updated successfully", "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error updating song", "error": str(error), "status": False}), 500

def getAllSongs():
    try:
        db: Session = next(get_db())
        songs = db.query(Song).all()
        songs_list = [song.to_dict() for song in songs]  # Convierte las canciones a diccionario
        return jsonify({"songs": songs_list, "status": True}), 200
    except Exception as error:
        return jsonify({"message": "Error fetching songs", "error": str(error), "status": False}), 500

def getSongById(id):
    try:
        db: Session = next(get_db())
        song = db.query(Song).filter_by(id=id).first()

        if not song:
            return jsonify({"message": "Song not found", "status": False}), 404

        return jsonify({"song": song.to_dict(), "status": True}), 200
    except Exception as error:
        return jsonify({"message": "Error fetching song", "error": str(error), "status": False}), 500

def deleteSong(id):
    try:
        db: Session = next(get_db())
        song = db.query(Song).filter_by(id=id).first()

        if not song:
            return jsonify({"message": "Song not found", "status": False}), 404

        db.delete(song)
        db.commit()
        return jsonify({"message": "Song deleted successfully", "status": True}), 200
    except Exception as error:
        return jsonify({"message": "Error deleting song", "error": str(error), "status": False}), 500