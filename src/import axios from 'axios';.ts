import axios from 'axios';

const api = axios.create({
  baseURL: 'https://be-tn6p.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchData = async (retryCount = 0) => {
  try {
    const response = await api.get('/', {
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    // ...existing code...
  }
};