import api from './api';

export const mlService = {
  predictPrice: async ({ commodity, state, district, market, horizonDays = 7 }) => {
    const response = await api.post('/ml/price/predict', {
      commodity,
      state,
      district,
      market,
      horizonDays: Number(horizonDays) || 7,
    });
    return response.data;
  },

  forecastDemand: async ({ product, location, horizonDays = 7 }) => {
    const response = await api.post('/ml/demand/forecast', {
      product,
      location,
      horizonDays: Number(horizonDays) || 7,
    });
    return response.data;
  },

  getMLOptions: async () => {
    const response = await api.get('/ml/options');
    return response.data;
  },
};

export default mlService;
