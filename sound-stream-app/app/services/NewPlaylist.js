import { API_BASE_URL, ENDPOINTS } from './config';
export const NEW_PLAYLIST = async (updatedUser) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.NEW_PLAYLIST}`, {
            method: 'POST',
            body: updatedUser,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al crear playlist', error);
        throw error; 
    }
};