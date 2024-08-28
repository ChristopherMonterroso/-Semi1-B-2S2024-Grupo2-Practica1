from flask import Blueprint, request, jsonify
import controllers.songController as songController

songController_bp = Blueprint('songController_bp', __name__, url_prefix = '/api/songs')

@songController_bp.route('/', methods=['POST'])
def createSong():
    return songController.createSong()

@songController_bp.route('/<int:id>', methods=['PUT'])
def updateSong(id):
    return songController.updateSong(id)

@songController_bp.route('/', methods=['GET'])
def getAllSongs():
    return songController.getAllSongs()

@songController_bp.route('/<int:id>', methods=['GET'])
def getSongById(id):
    return songController.getSongById(id)

@songController_bp.route('/<int:id>', methods=['DELETE'])
def deleteSong(id):
    return songController.deleteSong(id)