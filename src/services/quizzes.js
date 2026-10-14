import api from './api';

export const quizService = {
  async getQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  async getQuiz(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  async generateQuiz({ documentId, questionCount = 5 }) {
    // Try POST /quizzes/generate or fallback to /quizzes
    try {
      const response = await api.post('/quizzes/generate', {
        documentId,
        questionCount,
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const response = await api.post('/quizzes', {
          documentId,
          questionCount,
        });
        return response.data;
      }
      throw err;
    }
  },

  async submitAttempt(quizId, { answers }) {
    const response = await api.post(`/quizzes/${quizId}/attempts`, {
      answers,
    });
    return response.data;
  },
};

export default quizService;
