import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // We'll handle tokens via cookies in production, but for local dev
  // we might use localStorage if needed
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
              { refreshToken }
            );
            
            const { accessToken, refreshToken: newRefreshToken } = res.data;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
