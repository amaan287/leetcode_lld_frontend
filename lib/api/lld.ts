import { apiClient } from './client';
import { LLDQuestion, LLDAnswer } from '@/types';

export const lldApi = {
  getQuestions: async (filters?: { category?: string; difficulty?: string }): Promise<LLDQuestion[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await apiClient.get<LLDQuestion[]>(`/lld/questions?${params.toString()}`);
    return response.data;
  },

  getQuestion: async (id: string): Promise<LLDQuestion> => {
    const response = await apiClient.get<LLDQuestion>(`/lld/questions/${id}`);
    return response.data;
  },

  submitAnswer: async (questionId: string, answer: string): Promise<LLDAnswer> => {
    const response = await apiClient.post<LLDAnswer>(`/lld/questions/${questionId}/rate`, { answer });
    return response.data;
  },

  getMyAnswers: async (): Promise<LLDAnswer[]> => {
    const response = await apiClient.get<LLDAnswer[]>('/lld/answers');
    return response.data;
  },
};

