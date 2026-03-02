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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black transition-colors">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">LLD Practice</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                  Practice machine coding round questions and get AI-powered feedback on your solutions.
                </p>
              </div>
              <Link
                href="/lld/theory"
                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition font-medium"
              >
                Learn Theory
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2"
                  placeholder="Filter by category"
                />
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2"
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
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Link
                  key={question._id}
                  href={`/lld/questions/${question._id}`}
                  className="block bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{question.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {question.scenario.substring(0, 150)}
                    {question.scenario.length > 150 && '...'}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${question.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : question.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full">
                      {question.category}
                    </span>
                  </div>
                </Link>
              ))}
              {questions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
                  <div className="text-4xl mb-4">📘</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    No questions found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-md">
                    Try adjusting your filters or explore theory to strengthen your fundamentals.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
