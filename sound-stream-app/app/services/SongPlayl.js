import { API_BASE_URL, ENDPOINTS } from './config';
export const LIST_SONGSPLAYLIST = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.NEW_PLAYLIST}${id}/getSongs`, 
            {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las canciones de la playlist', error);
        throw error; 
    }
};
