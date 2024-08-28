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
