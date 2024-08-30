import { API_BASE_URL, ENDPOINTS } from './config';
export const LIST_SONGS = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SONGS}`, 
            {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las playlist', error);
        throw error; 
    }
};
