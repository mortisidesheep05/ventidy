import apiClient from './apiClient'

const userService = {
  list: async (params) => {
    const { data } = await apiClient.get('/users', { params })
    return data
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/users/${id}`)
    return data
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/users/${id}`, payload)
    return data
  },
  remove: async (id) => {
    const { data } = await apiClient.delete(`/users/${id}`)
    return data
  },
}

export default userService
