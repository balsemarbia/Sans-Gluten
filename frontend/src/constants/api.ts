// API Configuration
export const API_BASE_URL = 'http://192.168.1.17:5000/api';

// Pour le développement local sur PC, utilisez localhost
// export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
export const apiCall = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  token?: string
) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const config: any = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get stored token (localStorage instead of AsyncStorage)
export const getToken = (): string | null => {
  try {
    return localStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Set token
export const setToken = (token: string): void => {
  try {
    localStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

// Remove token
export const removeToken = (): void => {
  try {
    localStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
