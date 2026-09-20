import api from './api';

const fileService = {
  /**
   * Upload a file to Cloudinary via backend API
   */
  uploadFile: async (file, metaData = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    if (metaData.category) formData.append('category', metaData.category);
    if (metaData.subCategory) formData.append('subCategory', metaData.subCategory);
    if (metaData.documentType) formData.append('documentType', metaData.documentType);
    if (metaData.entityType) formData.append('entityType', metaData.entityType);
    if (metaData.entityId) formData.append('entityId', metaData.entityId);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: metaData.onProgress,
    });
    return response.data;
  },

  /**
   * Fetch uploaded file records
   */
  getUserFiles: async (params = {}) => {
    const response = await api.get('/files', { params });
    return response.data;
  },

  /**
   * Delete an uploaded file asset
   */
  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
};

export default fileService;
