import { apiClient } from './client';
import { DSAList, DSAProblem, ListWithProblems } from '@/types';

export const dsaApi = {
  createList: async (name: string, isPublic: boolean = false): Promise<DSAList> => {
    const response = await apiClient.post<DSAList>('/dsa/lists', { name, isPublic });
    return response.data;
  },

  getMyLists: async (): Promise<DSAList[]> => {
    const response = await apiClient.get<DSAList[]>('/dsa/lists');
    return response.data;
  },

  getPublicLists: async (): Promise<DSAList[]> => {
    const response = await apiClient.get<DSAList[]>('/dsa/lists/public');
    return response.data;
  },

  getList: async (id: string): Promise<ListWithProblems> => {
    const response = await apiClient.get<ListWithProblems>(`/dsa/lists/${id}`);
    return response.data;
  },

  updateList: async (id: string, updates: { name?: string; isPublic?: boolean }): Promise<DSAList> => {
    const response = await apiClient.put<DSAList>(`/dsa/lists/${id}`, updates);
    return response.data;
  },

  deleteList: async (id: string): Promise<void> => {
    await apiClient.delete(`/dsa/lists/${id}`);
  },

  addProblem: async (listId: string, problemId: string): Promise<void> => {
    await apiClient.post(`/dsa/lists/${listId}/problems`, { problemId });
  },

  removeProblem: async (listId: string, problemId: string): Promise<void> => {
    await apiClient.delete(`/dsa/lists/${listId}/problems/${problemId}`);
  },

  toggleProblemStatus: async (listId: string, problemId: string, isCompleted: boolean): Promise<void> => {
    await apiClient.post(`/dsa/lists/${listId}/problems/${problemId}/toggle`, { isCompleted });
  },

  searchByCompany: async (companyName: string, role: string = 'SDE'): Promise<DSAProblem[]> => {
    const response = await apiClient.post<DSAProblem[]>('/dsa/search/company', {
      companyName,
      role,
    });
    return response.data;
  },

  searchByQuery: async (query: string, limit: number = 100): Promise<DSAProblem[]> => {
    const response = await apiClient.post<DSAProblem[]>('/dsa/search/query', {
      query,
      limit,
    });
    return response.data;
  },

  searchProblems: async (query: string, limit: number = 50): Promise<DSAProblem[]> => {
    const response = await apiClient.post<DSAProblem[]>('/dsa/search/problems', {
      query,
      limit,
    });
    return response.data;
  },

  getProblems: async (limit: number = 100, skip: number = 0): Promise<DSAProblem[]> => {
    const response = await apiClient.get<DSAProblem[]>('/dsa/problems', {
      params: { limit, skip },
    });
    return response.data;
  },

  getProblem: async (id: string): Promise<DSAProblem> => {
    const response = await apiClient.get(`/dsa/problems/${id}`);
    // Check if response contains an error object (even with 200 status)
    if (response.data && 'error' in response.data) {
      const error = response.data.error;
      throw new Error(error.message || 'Problem not found');
    }
    return response.data as DSAProblem;
  },
};

