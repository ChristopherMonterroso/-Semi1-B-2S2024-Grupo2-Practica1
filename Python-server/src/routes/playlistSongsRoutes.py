from flask import Blueprint, request, jsonify
import controllers.playlistSongsController as playlistSongsController

playlistSongsController_bp = Blueprint('playlistSongsController_bp', __name__, url_prefix = '/api/user/playlist')

@playlistSongsController_bp.route('/addSong', methods=['POST'])
def addPlaylistSong():
    return playlistSongsController.addPlaylistSong()

@playlistSongsController_bp.route('/deleteSong/<int:id_playlist>/<int:id_song>', methods=['DELETE'])
def deletePlaylistSong(id_playlist, id_song):
    return playlistSongsController.deletePlaylistSong(id_playlist, id_song)

@playlistSongsController_bp.route('/<int:id_playlist>/getSongs', methods=['GET'])
def getSongsByPlaylist(id_playlist):
    return playlistSongsController.getSongsByPlaylist(id_playlist)
