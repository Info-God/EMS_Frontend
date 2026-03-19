import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Check if the error response status is 401
    if (error.response && error.response.status === 401) {
      // Navigate to home page
      localStorage.removeItem("token")
      // window.location.href = '/';
    }
    
    // Reject the promise to allow error handling in calling code
    return Promise.reject(error);
  }
);

export default axiosClient;