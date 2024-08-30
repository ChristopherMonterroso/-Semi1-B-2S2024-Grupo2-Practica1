import { API_BASE_URL, ENDPOINTS } from './config';
export const ADDFAVORITE = async (id, idfav) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADD_FAVORITE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "id_user": id, 
                "id_song": idfav 
            }),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al agregar favorito', error);
        throw error; 
    }
};
