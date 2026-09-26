import api from './api';

const transportService = {
  getRequests: async () => {
    const res = await api.get('/transport/requests');
    return res.data;
  },

  createRequest: async (data) => {
    const res = await api.post('/transport/requests', data);
    return res.data;
  },

  getRequestById: async (id) => {
    const res = await api.get(`/transport/requests/${id}`);
    return res.data;
  },

  submitQuotation: async (requestId, data) => {
    const res = await api.post(`/transport/requests/${requestId}/quotes`, data);
    return res.data;
  },

  withdrawQuotation: async (quoteId) => {
    const res = await api.post(`/transport/quotes/${quoteId}/withdraw`);
    return res.data;
  },

  selectQuotation: async (requestId, quotationId) => {
    const res = await api.post(`/transport/requests/${requestId}/select-quote`, { quotationId });
    return res.data;
  },

  acceptQuotationJob: async (quoteId) => {
    const res = await api.post(`/transport/quotes/${quoteId}/accept`);
    return res.data;
  },

  updateShipmentStatus: async (requestId, shipmentStatus) => {
    const res = await api.put(`/transport/requests/${requestId}/shipment-status`, { shipmentStatus });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/transport/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/transport/profile', data);
    return res.data;
  },

  getTransporterShipments: async () => {
    const res = await api.get('/transport/my-shipments');
    return res.data;
  },
};

export default transportService;
