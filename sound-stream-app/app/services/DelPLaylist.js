import { API_BASE_URL, ENDPOINTS } from './config';
export const DEL_PLAYLIST = async (Id_play) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.NEW_PLAYLIST}${Id_play}`, 
            {method: 'DELETE'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar playlist', error);
        throw error; 
    }
};