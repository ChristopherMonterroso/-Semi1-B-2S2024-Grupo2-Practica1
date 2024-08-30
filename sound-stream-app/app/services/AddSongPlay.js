import { API_BASE_URL, ENDPOINTS } from './config';
export const ADDSONGPLAY = async (id_play, id_can) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADD_SONGPLAY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "id_playlist": id_play, 
                "id_song": id_can 
            }),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al agregar favorito', error);
        throw error; 
    }
};
