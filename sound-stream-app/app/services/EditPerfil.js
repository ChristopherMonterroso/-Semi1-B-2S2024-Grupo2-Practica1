import { API_BASE_URL, ENDPOINTS } from './config';
export const EDIT_USER = async (id, resBody) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EDIT_USER}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resBody),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al editar sesión', error);
        throw error; 
    }
};
