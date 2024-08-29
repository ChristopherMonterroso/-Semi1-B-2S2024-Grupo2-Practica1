export const API_BASE_URL = 'http://localhost:5000/api';

export const ENDPOINTS = {
  LOGIN: '/users/authenticate',
  REGISTER: '/users',
  UPDATE_USER: '/users',
  SONGS: '/songs',
  EDIT_USER: '/users',
  GET_PLAYLISTS: '/user/playlist/by_user?id_user=',
  NEW_PLAYLIST: '/user/playlist/',
  ADD_FAVORITE: '/user/favorite/addFavorite',
  SONGS_FAVORITE: '/user/favorite/',
  DEL_SONGPLAY: '/user/playlist/deleteSong/'

};
