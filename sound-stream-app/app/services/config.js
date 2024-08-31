import { DEL_SONGFAVORITE } from "./DelSongFav";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  DEL_SONGPLAY: '/user/playlist/deleteSong/',
  DEL_SONGFAVORITE: '/user/favorite/removeFavorite/',
  ADD_SONGPLAY: '/user/playlist/addSong'

};
