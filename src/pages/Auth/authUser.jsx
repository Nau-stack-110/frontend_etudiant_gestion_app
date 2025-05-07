import axios from 'axios';

const API_URL = 'https://api-etudiant-esdes.onrender.com/api'; 

export const registerUser = async (formData) => {
  return await axios.post(`${API_URL}/register/`, formData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/token/`, credentials);
};