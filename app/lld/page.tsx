'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { lldApi } from '@/lib/api/lld';
import { LLDQuestion } from '@/types';

export default function LLDPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<LLDQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadQuestions();
  }, [categoryFilter, difficultyFilter, isAuthenticated, router]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (difficultyFilter) filters.difficulty = difficultyFilter;
      const data = await lldApi.getQuestions(filters);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">LLD Practice</h1>
                <p className="text-gray-600 mt-2">
                  Practice machine coding round questions and get AI-powered feedback on your solutions.
                </p>
              </div>
              <Link
                href="/lld/theory"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-black"
              >
                Learn Theory
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Filter by category"
                />
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <Link
                  key={question._id}
                  href={`/lld/questions/${question._id}`}
                  className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {question.scenario.substring(0, 150)}
                    {question.scenario.length > 150 && '...'}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        question.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800'
                          : question.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {question.category}
                    </span>
                  </div>
                </Link>
              ))}
              {questions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No questions found. Try adjusting your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

