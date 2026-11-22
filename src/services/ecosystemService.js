import api from './api';

export const ecosystemService = {
  // Public: Get all active brand ecosystems
  getAllEcosystems: async () => {
    const response = await api.get('/ecosystems');
    return response.data;
  },

  // Public: Get single brand ecosystem by slug (e.g. apple, samsung, nothing)
  getEcosystemBySlug: async (slug) => {
    const response = await api.get(`/ecosystems/${slug}`);
    return response.data;
  },

  // Admin: Create new brand ecosystem
  createEcosystem: async (data) => {
    const response = await api.post('/ecosystems', data);
    return response.data;
  },

  // Admin: Update existing brand ecosystem
  updateEcosystem: async (id, data) => {
    const response = await api.put(`/ecosystems/${id}`, data);
    return response.data;
  },

  // Admin: Delete brand ecosystem
  deleteEcosystem: async (id) => {
    const response = await api.delete(`/ecosystems/${id}`);
    return response.data;
  },

  // Admin: Upload hero video or image
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

