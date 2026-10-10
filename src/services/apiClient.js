import axios from 'axios'

// Base URL is read from the environment so the same build can point at
// any Node.js/Express + MySQL backend without code changes.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach auth token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ventidy-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global response/error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ventidy-token')
      localStorage.removeItem('ventidy-user')
    }
    return Promise.reject(error)
  }
)

export default apiClient
