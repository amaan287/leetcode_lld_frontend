'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { dsaApi } from '@/lib/api/dsa';
import { DSAProblem } from '@/types';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const problemId = params.id as string;
  const [problem, setProblem] = useState<DSAProblem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    if (!problemId) {
      console.error('Problem ID is missing');
      alert('Invalid problem ID');
      router.push('/dsa');
      return;
    }
    loadProblem();
  }, [problemId, isAuthenticated, router]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const data = await dsaApi.getProblem(problemId);
      console.log('Problem data received:', data);
      
      // Check if response contains an error object (even with 200 status)
      if (data && 'error' in data) {
        const errorData = data as any;
        alert(errorData.error?.message || 'Problem not found');
        router.push('/dsa');
        return;
      }
      
      if (!data || !data._id) {
        console.error('Invalid problem data:', data);
        alert('Problem not found');
        router.push('/dsa');
        return;
      }
      
      setProblem(data);
    } catch (error: any) {
      console.error('Failed to load problem:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      // Check for different error scenarios
      if (error.response?.status === 404) {
        alert('Problem not found');
        router.push('/dsa');
      } else if (error.response?.status === 401) {
        // Auth error - will be handled by interceptor
        return;
      } else {
        // Other errors - show generic message
        const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to load problem';
        console.error('Error message:', errorMessage);
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated() || loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!problem) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div>Problem not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const leetcodeUrl = `https://leetcode.com/problems/${problem.titleSlug}`;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="text-black hover:text-blue-700 mb-6"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {problem.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    {problem.acRate && (
                      <span className="text-sm text-gray-600">
                        Acceptance Rate: {problem.acRate.toFixed(1)}%
                      </span>
                    )}
                    {problem.paidOnly && (
                      <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded font-semibold">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Problem ID:</span>
                    <span className="ml-2 text-sm text-gray-900">{problem.frontendQuestionId}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Slug:</span>
                    <span className="ml-2 text-sm text-gray-900 font-mono">{problem.titleSlug}</span>
                  </div>
                  {problem.topicTags && problem.topicTags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Topics:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {problem.topicTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md"
                          >
                            {tag.name || tag.slug}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Solutions</h2>
                <div className="space-y-2">
                  {problem.hasSolution && (
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Solution available
                    </div>
                  )}
                  {problem.hasVideoSolution && (
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Video solution available
                    </div>
                  )}
                  {!problem.hasSolution && !problem.hasVideoSolution && (
                    <p className="text-sm text-gray-500">No solutions available</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <a
                  href={leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <span>View on LeetCode</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

