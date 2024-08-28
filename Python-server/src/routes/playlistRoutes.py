from flask import Blueprint, request, jsonify
import controllers.playlistController as playlistController

playlistController_bp = Blueprint('playlistController_bp', __name__, url_prefix = '/api/user/playlist')

@playlistController_bp.route('/', methods=['POST'])
def createPlaylist():
    return playlistController.createPlaylist()

@playlistController_bp.route('/<int:id>', methods=['PUT'])
def updatePlaylist(id):
    return playlistController.updatePlaylist(id)

@playlistController_bp.route('/', methods=['GET'])
def getAllPlaylists():
    return playlistController.getAllPlaylists()

@playlistController_bp.route('/by_user', methods=['GET'])
def getPlaylistByUser():
    return playlistController.getPlaylistByUser()

@playlistController_bp.route('/<int:id>', methods=['GET'])
def getPlaylistById(id):
    return playlistController.getPlaylistById(id)

@playlistController_bp.route('/<int:id>', methods=['DELETE'])
def deletePlaylist(id):
    return playlistController.deletePlaylist(id)