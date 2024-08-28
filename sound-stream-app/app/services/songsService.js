import { API_BASE_URL, ENDPOINTS } from './config';

export const getSongs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SONGS}`, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las canciones:', error);
    return [];
  }
};

export const deleteSong = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SONGS}/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar la canción:', error);
    return false;
  }
};

export const createSong = async (songData) => {
  try {
    const formData = new FormData();
    formData.append('name', songData.name);
    formData.append('duration', songData.duration);
    formData.append('artist', songData.artist);
    formData.append('photo', songData.photo);
    formData.append('mp3File', songData.mp3File);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SONGS}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al crear la canción');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear la canción:', error);
    return null;
  }
};
