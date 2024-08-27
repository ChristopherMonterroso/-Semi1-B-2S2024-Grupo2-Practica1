import { API_BASE_URL, ENDPOINTS } from './config';

export const registerUser = async (name, lastName, email, password, birthdate, profilePhoto) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthdate', birthdate);
    formData.append('profilePhoto', profilePhoto);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al crear usuario', error);
    throw error; 
  }
};