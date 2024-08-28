from flask import Blueprint, request, jsonify
import controllers.userController as userController

userController_bp = Blueprint('userController_bp', __name__, url_prefix = '/api/users')

@userController_bp.route('/', methods=['POST'])
def createUser():
    return userController.createUser()

@userController_bp.route('/<int:id>', methods=['PUT'])
def updateUser(id):
    return userController.updateUser(id)

@userController_bp.route('/authenticate', methods=['POST'])
def authenticateUser():
    return userController.authenticateUser()

@userController_bp.route('/<int:id>', methods=['DELETE'])
def deleteUser(id):
    return userController.deleteUser(id)

@userController_bp.route('/', methods=['GET'])
def getUsers():
    return userController.getUsers()