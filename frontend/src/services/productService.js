import api from './api';

const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  getProduct: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data) => {
    const res = await api.post('/products', data);
    return res.data;
  },

  updateProduct: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export default productService;
