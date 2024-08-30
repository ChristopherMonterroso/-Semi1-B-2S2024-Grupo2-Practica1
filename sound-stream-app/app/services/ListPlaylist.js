import { API_BASE_URL, ENDPOINTS } from './config';
export const LIST_PLAYLIST = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_PLAYLISTS}${id}`, 
            {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las playlist', error);
        throw error; 
    }
};
