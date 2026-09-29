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

  // Transporter Verification API
  getVerification: async () => {
    const res = await api.get('/transport/verification');
    return res.data;
  },
  saveBasicDetails: async (data) => {
    const res = await api.post('/transport/verification/basic-details', data);
    return res.data;
  },
  saveIdentity: async (data) => {
    const res = await api.post('/transport/verification/identity', data);
    return res.data;
  },
  saveBusinessRegistration: async (data) => {
    const res = await api.post('/transport/verification/business-registration', data);
    return res.data;
  },
  saveBankAccount: async (data) => {
    const res = await api.post('/transport/verification/bank-account', data);
    return res.data;
  },
  saveVehicle: async (data) => {
    const res = await api.post('/transport/verification/vehicles', data);
    return res.data;
  },
  deleteVehicle: async (vehicleId) => {
    const res = await api.delete(`/transport/verification/vehicles/${vehicleId}`);
    return res.data;
  },
  saveDriver: async (data) => {
    const res = await api.post('/transport/verification/drivers', data);
    return res.data;
  },
  deleteDriver: async (driverId) => {
    const res = await api.delete(`/transport/verification/drivers/${driverId}`);
    return res.data;
  },
  submitVerification: async () => {
    const res = await api.post('/transport/verification/submit');
    return res.data;
  },
  skipStep: async (stepKey) => {
    const res = await api.post('/transport/verification/skip-step', { stepKey });
    return res.data;
  },
};

export default transportService;
