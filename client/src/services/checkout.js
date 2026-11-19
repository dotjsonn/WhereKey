import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000
})

const getKeys = async () => {
  const response = await api.get('/keys')
  return response.data
}

const create = async (keyId) => {
  const response = await api.post('/checkouts', { keyId })
  return response.data
}

const returnKey = async (checkoutId) => {
  const response = await api.patch(`/checkouts/${checkoutId}/return`)
  return response.data
}

const getMyHistory = async () => {
  const response = await api.get('/checkouts/me')
  return response.data
}

export default { getKeys, create, returnKey, getMyHistory }