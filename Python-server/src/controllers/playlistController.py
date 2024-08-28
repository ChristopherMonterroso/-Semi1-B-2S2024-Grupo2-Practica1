import os
from flask import request, jsonify
from sqlalchemy.orm import Session
from werkzeug.utils import secure_filename
from config.db import get_db
from models.playlist import Playlist
from boto3 import client
from dotenv import load_dotenv
from io import BytesIO
from datetime import datetime

load_dotenv()

s3 = client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

def createPlaylist():
    try:
        # Obtener los datos del formulario
        name = request.form.get('name')
        description = request.form.get('description')
        id_user = request.form.get('id_user')
        cover = request.files.get('cover')

        if not all([name, id_user, cover]):
            return jsonify({"message": "All fields are required", "status": False}), 400

        db: Session = next(get_db())

        # Verificar si la playlist ya existe
        existing_playlist = db.query(Playlist).filter_by(name=name).first()
        if existing_playlist:
            return jsonify({"message": "Playlist already exists", "status": False}), 400

        # Subir la imagen de la portada a S3
        cover_filename = f"Fotos/CPL_{datetime.now().timestamp()}_{secure_filename(cover.filename)}"
        s3.upload_fileobj(
            Fileobj=BytesIO(cover.read()),
            Bucket=os.getenv('BUCKET_NAME'),
            Key=cover_filename,
            ExtraArgs={"ContentType": cover.content_type}
        )
        cover_url = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{cover_filename}"

        # Crear la playlist en la base de datos
        new_playlist = Playlist(
            name=name,
            description=description,
            cover=cover_url,
            id_user=id_user
        )
        db.add(new_playlist)
        db.commit()

        return jsonify({"playlist": new_playlist.to_dict(), "message": "Playlist created successfully", "status": True}), 201

    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500

def getAllPlaylists():
    try:
        db: Session = next(get_db())
        playlists = db.query(Playlist).all()
        playlists_dict = [playlist.to_dict() for playlist in playlists]
        return jsonify({"playlists": playlists_dict, "status": True}), 200
    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500

def getPlaylistById(id):
    try:
        db: Session = next(get_db())
        playlist = db.query(Playlist).filter(Playlist.id == id).first()
        if playlist:
            return jsonify({"playlist": playlist.to_dict(), "status": True}), 200
        else:
            return jsonify({"message": "Playlist not found", "status": False}), 404

    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500

def getPlaylistByUser():
    try:
        # Obtener el parámetro de consulta 'id_user'
        id_user = request.args.get('id_user')
        
        db: Session = next(get_db())
        
        # Obtener todas las playlists del usuario con id_user
        playlists = db.query(Playlist).filter_by(id_user=id_user).all()
        
        if playlists:
            return jsonify({"playlist": [playlist.to_dict() for playlist in playlists], "status": True}), 200
        else:
            return jsonify({"message": "Playlist not found", "status": False}), 404

    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500

def updatePlaylist(id):
    try:
        # Obtener la sesión de base de datos
        db: Session = next(get_db())
        
        # Obtener los datos del formulario
        name = request.form.get('name')
        description = request.form.get('description')
        cover = request.files.get('cover')

        update_data = {}
        if name:
            update_data['name'] = name
        if description:
            update_data['description'] = description

        # Verificar si la playlist existe
        playlist = db.query(Playlist).filter_by(id=id).first()
        if not playlist:
            return jsonify({"message": "Playlist not found", "status": False}), 404

        # Si se proporciona una nueva portada, subirla a S3
        if cover:
            cover_filename = f"Fotos/CPL_{datetime.now().timestamp()}_{secure_filename(cover.filename)}"
            s3.upload_fileobj(
                Fileobj=BytesIO(cover.read()),
                Bucket=os.getenv('BUCKET_NAME'),
                Key=cover_filename,
                ExtraArgs={"ContentType": cover.content_type}
            )
            update_data['cover'] = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/{cover_filename}"

        if not update_data:
            return jsonify({"message": "No data provided", "status": False}), 400

        # Actualizar la playlist en la base de datos
        for key, value in update_data.items():
            setattr(playlist, key, value)

        db.commit()

        return jsonify({"message": "Playlist updated successfully", "status": True}), 200

    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500

def deletePlaylist(id):
    try:
        db: Session = next(get_db())
        
        # Intentar eliminar la playlist por ID
        deleted = db.query(Playlist).filter_by(id=id).delete()
        db.commit()
        
        if deleted:
            return jsonify({"message": "Playlist deleted", "status": True}), 200
        else:
            return jsonify({"message": "Playlist not found", "status": False}), 404

    except Exception as error:
        return jsonify({"error": str(error), "status": False}), 500