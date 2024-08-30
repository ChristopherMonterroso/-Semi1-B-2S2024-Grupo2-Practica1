import { API_BASE_URL, ENDPOINTS } from './config';
export const DEL_SONGPLAYLIST = async (Id_play, Id_song) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DEL_SONGPLAY}${Id_play}/${Id_song}`, 
            {method: 'DELETE'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar cancion de playlist', error);
        throw error; 
    }
};