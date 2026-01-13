'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { dsaApi } from '@/lib/api/dsa';
import { ListWithProblems, ProblemWithStatus } from '@/types';

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const listId = params.id as string;
  const [data, setData] = useState<ListWithProblems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadList();
  }, [listId, isAuthenticated, router]);

  const loadList = async () => {
    try {
      setLoading(true);
      const listData = await dsaApi.getList(listId);
      setData(listData);
    } catch (error: any) {
      console.error('Failed to load list:', error);
      if (error.response?.status === 404) {
        alert('List not found');
        router.push('/dsa');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (problemId: string, currentStatus: boolean) => {
    try {
      await dsaApi.toggleProblemStatus(listId, problemId, !currentStatus);
      await loadList();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update problem status');
    }
  };

  const handleRemoveProblem = async (problemId: string) => {
    if (!confirm('Remove this problem from the list?')) return;

    try {
      await dsaApi.removeProblem(listId, problemId);
      await loadList();
    } catch (error) {
      console.error('Failed to remove problem:', error);
      alert('Failed to remove problem');
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

  if (!data) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div>List not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  const isOwner = data.list.userId === user?._id;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blackver:text-blue-700 mb-4"
            >
              ← Back to Lists
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{data.list.name}</h1>
            <p className="text-gray-500 mt-2">
              {data.problems.length} problem{data.problems.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Problems</h2>
                {isOwner && (
                  <Link
                    href={`/dsa/lists/${listId}/add-problems`}
                    className="text-sm text-black hover:text-blue-700"
                  >
                    Add Problems
                  </Link>
                )}
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {data.problems.map((item: ProblemWithStatus) => (
                <li key={item.problem._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <input
                        type="checkbox"
                        checked={item.status?.isCompleted || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(
                            item.problem._id,
                            item.status?.isCompleted || false
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <Link
                        href={`/dsa/problems/${item.problem._id}`}
                        className="ml-4 flex-1 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.problem.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {item.problem.frontendQuestionId} • {item.problem.titleSlug}
                            {item.problem.acRate && ` • ${item.problem.acRate.toFixed(1)}% acceptance`}
                          </p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                item.problem.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-800'
                                  : item.problem.difficulty === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.problem.difficulty}
                            </span>
                            {item.problem.paidOnly && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                Premium
                              </span>
                            )}
                            {item.problem.topicTags && item.problem.topicTags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.problem.topicTags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                  >
                                    {tag.name || tag.slug}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {item.status?.checkedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              Completed on {new Date(item.status.checkedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveProblem(item.problem._id);
                        }}
                        className="ml-4 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {data.problems.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No problems in this list yet.
                {isOwner && (
                  <Link
                    href={`/dsa/lists/${listId}/add-problems`}
                    className="text-black hover:text-blue-700 ml-1"
                  >
                    Add some problems
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

