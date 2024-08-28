import os
import bcrypt
import boto3
from flask import request, jsonify
from config.db import engine, Base, get_db
from models.user import User
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

def createUser():
    try:
        # Obtener los datos del formulario
        name = request.form.get('name')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        birthdate = request.form.get('birthdate')
        rol = "Sub"

        # Verificar que todos los campos estén presentes
        if not all([name, lastName, email, password, birthdate, 'profilePhoto' in request.files]):
            return jsonify({"message": "All fields are required", "status": False}), 400

        db: Session = next(get_db())

        # Verificar si el usuario ya existe
        existing_user = db.query(User).filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "Email already in use", "status": False}), 400

        # Encriptar la contraseña
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Subir la imagen a S3 con nombre único
        profile_photo = request.files['profilePhoto']
        original_filename = secure_filename(profile_photo.filename)
        unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
        s3.upload_fileobj(
            profile_photo,
            os.getenv('BUCKET_NAME'),
            f"Fotos/{unique_filename}",
            ExtraArgs={"ContentType": profile_photo.content_type}
        )

        # Crear el nuevo usuario
        user = User(
            name=name,
            lastName=lastName,
            email=email,
            password=hashed_password.decode('utf-8'),
            birthdate=birthdate,
            rol=rol,
            profilePhoto=f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/Fotos/{unique_filename}"
        )

        db.add(user)
        db.commit()

        return jsonify({"message": "User created successfully", "user": user.to_dict(), "status": True}), 201

    except Exception as error:
        return jsonify({"message": "Error creating user", "error": str(error), "status": False}), 500

def updateUser(id):
    try:
        # Obtener los datos del formulario
        name = request.form.get('name')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        profilePhoto = request.files.get('profilePhoto')

        # Verificar que el ID sea válido
        if not id:
            return jsonify({"message": "User ID is required", "status": False}), 400

        if id == 1:
            return jsonify({"message": "You cannot update the admin user", "status": False}), 400

        db: Session = next(get_db())
        user = db.query(User).filter_by(id=id).first()

        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        # Verificar si el correo ya está en uso
        if email:
            existing_user = db.query(User).filter(User.email == email, User.id != id).first()
            if existing_user:
                return jsonify({"message": "Email already in use", "status": False}), 400

        # Verificar la contraseña
        if password:
            is_password_valid = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
            if not is_password_valid:
                return jsonify({"message": "Incorrect password", "status": False}), 401

        # Actualizar los datos del usuario
        if name:
            user.name = name
        if lastName:
            user.lastName = lastName
        if email:
            user.email = email
        if password:
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
            user.password = hashed_password.decode('utf-8')

        # Si se sube una nueva imagen de perfil
        if profilePhoto:
            # Eliminar la imagen antigua de S3 si existe
            if user.profilePhoto:
                old_filename = user.profilePhoto.split('/')[-1]
                s3.delete_object(Bucket=os.getenv('BUCKET_NAME'), Key=f"Fotos/{old_filename}")

            # Subir la nueva imagen a S3
            original_filename = secure_filename(profilePhoto.filename)
            unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
            s3.upload_fileobj(
                profilePhoto,
                os.getenv('BUCKET_NAME'),
                f"Fotos/{unique_filename}",
                ExtraArgs={"ContentType": profilePhoto.content_type}
            )
            user.profilePhoto = f"https://{os.getenv('BUCKET_NAME')}.s3.amazonaws.com/Fotos/{unique_filename}"

        # Actualizar el campo updatedAt
        user.updatedAt = datetime.utcnow()
        db.commit()

        return jsonify({"message": "User updated successfully", "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error updating user", "error": str(error), "status": False}), 500

def authenticateUser():
    try:
        # Obtener los datos del formulario
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required", "status": False}), 400

        db: Session = next(get_db())
        user = db.query(User).filter_by(email=email).first()

        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        # Verificar la contraseña
        is_password_valid = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
        if not is_password_valid:
            return jsonify({"message": "Incorrect password", "status": False}), 401

        # Actualizar el campo signUpDate
        user.signUpDate = datetime.utcnow()
        db.commit()

        # Si la autenticación es exitosa
        return jsonify({"message": "User authenticated successfully", "user": user.to_dict(), "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error authenticating user", "error": str(error), "status": False}), 500

def deleteUser(id):
    try:
        if not id:
            return jsonify({"message": "User ID is required", "status": False}), 400

        db: Session = next(get_db())
        user = db.query(User).filter_by(id=id).first()

        if not user:
            return jsonify({"message": "User not found", "status": False}), 404

        db.delete(user)
        db.commit()

        return jsonify({"message": "User deleted successfully", "status": True}), 200

    except Exception as error:
        return jsonify({"message": "Error deleting user", "error": str(error), "status": False}), 500

def getUsers():
    try:
        # Obtén la sesión de la base de datos
        db: Session = next(get_db())
        
        # Consulta de usuarios
        users = db.query(User).all()
        users_dict = [user.to_dict() for user in users]  # Convierte cada usuario a diccionario
        return jsonify({"users": users_dict, "status": True}), 200
    except:
        return jsonify({"message": "Error fetching users", "error": str(error), "status": False}), 500