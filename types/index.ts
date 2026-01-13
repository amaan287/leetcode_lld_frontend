export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TopicTag {
  name?: string;
  id?: string;
  slug?: string;
}

export interface DSAProblem {
  _id: string;
  frontendQuestionId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acRate?: number;
  topicTags?: TopicTag[];
  paidOnly?: boolean;
  hasSolution?: boolean;
  hasVideoSolution?: boolean;
}

export interface DSAList {
  _id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  problemIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProblemWithStatus {
  problem: DSAProblem;
  status: {
    isCompleted: boolean;
    checkedAt?: string;
  } | null;
}

export interface ListWithProblems {
  list: DSAList;
  problems: ProblemWithStatus[];
}

export interface LLDQuestion {
  _id: string;
  title: string;
  scenario: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt?: string;
}

export interface LLDAnswer {
  _id: string;
  userId: string;
  questionId: string;
  answer: string;
  rating?: number;
  feedback?: string;
  submittedAt: string;
}

