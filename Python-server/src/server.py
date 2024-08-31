from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

#   Importaciones de rutas
from routes.songRoutes import songController_bp
from routes.userRoutes import userController_bp
from routes.favoriteRoutes import favoriteController_bp
from routes.playlistRoutes import playlistController_bp
from routes.playlistSongsRoutes import playlistSongsController_bp

#   Instancia del servidor
server = Flask(__name__)
CORS(server)

#   Carga del puerto del servidor
load_dotenv()
PORT = int(os.getenv('PORT'))

#   Resgistro de rutas dentro del servidor
server.register_blueprint(songController_bp)
server.register_blueprint(userController_bp)
server.register_blueprint(favoriteController_bp)
server.register_blueprint(playlistController_bp)
server.register_blueprint(playlistSongsController_bp)

@server.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Hello World'}) 

if __name__ == '__main__':
    server.run(host= '0.0.0.0',debug=True, port=PORT)
