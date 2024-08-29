from flask import Blueprint, request, jsonify
import controllers.favoriteController as favoriteController

favoriteController_bp = Blueprint('favoriteController_bp', __name__, url_prefix = '/api/user/favorite')

@favoriteController_bp.route('/addFavorite', methods=['POST'])
def addFavorite():
    return favoriteController.addFavorite()

@favoriteController_bp.route('/<int:id_user>/favorites/', methods=['GET'])
def getFavoriteSongs(id_user):
    return favoriteController.getFavoriteSongs(id_user)

@favoriteController_bp.route('/removeFavorite/<int:id_user>/<int:id_song>', methods=['DELETE'])
def removeFavoriteSong(id_user, id_song):
    return favoriteController.removeFavoriteSong(id_user, id_song)