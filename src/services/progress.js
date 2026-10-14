import api from './api';

export const progressService = {
  async getOverview() {
    const response = await api.get('/progress/overview');
    return response.data;
  },

  async getActivity() {
    const response = await api.get('/progress/activity');
    return response.data;
  },
};

export default progressService;
