import axios from 'axios'

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
  timeout: 10000
})


const login = async (credentials) => {
  const response = await api.post('/login', credentials)
  return response.data
}

const register = async (credentials) => {
  const response = await api.post('/register', credentials)
  return response.data
}

const getMe = async () => {
  const response = await api.get('/me')
  return response.data
}

const logout = async () => {
  const response = await api.post('/logout')
  return response.data
}

export default {
  login, 
  register,
  getMe,
  logout
}