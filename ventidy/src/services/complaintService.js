import apiClient from './apiClient'

const complaintService = {
  create: async (formData) => {
    // formData is a FormData instance so the image upload travels with it
    const { data } = await apiClient.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  track: async ({ complaintId, phone }) => {
    const { data } = await apiClient.get('/complaints/track', {
      params: { complaintId, phone },
    })
    return data
  },

  list: async (params) => {
    const { data } = await apiClient.get('/complaints', { params })
    return data
  },

  updateStatus: async (id, status) => {
    const { data } = await apiClient.patch(`/complaints/${id}/status`, { status })
    return data
  },

  assignOfficer: async (id, officerId) => {
    const { data } = await apiClient.patch(`/complaints/${id}/assign`, { officerId })
    return data
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/complaints/${id}`)
    return data
  },

  getStats: async () => {
    const { data } = await apiClient.get('/complaints/stats')
    return data
  },
}

export default complaintService
