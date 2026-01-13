'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { dsaApi } from '@/lib/api/dsa';
import { DSAProblem, DSAList } from '@/types';

export default function CompanySearchPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('SDE');
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lists, setLists] = useState<DSAList[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [addingProblems, setAddingProblems] = useState<Set<string>>(new Set());
  const [addingAll, setAddingAll] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      loadLists();
    }
  }, [isAuthenticated, router]);

  const loadLists = async () => {
    try {
      setLoadingLists(true);
      const userLists = await dsaApi.getMyLists();
      setLists(userLists);
      if (userLists.length > 0 && !selectedListId) {
        setSelectedListId(userLists[0]._id);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const results = await dsaApi.searchByCompany(companyName, role);
      setProblems(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (problemId: string) => {
    if (!selectedListId) {
      alert('Please select a list first');
      return;
    }

    if (addingProblems.has(problemId)) return;

    try {
      setAddingProblems(prev => new Set(prev).add(problemId));
      await dsaApi.addProblem(selectedListId, problemId);
      
      // Update the list in state to reflect the new problem count
      setLists(lists.map(list => 
        list._id === selectedListId 
          ? { ...list, problemIds: [...list.problemIds, problemId] }
          : list
      ));
    } catch (error: any) {
      console.error('Failed to add problem:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to add problem to list';
      alert(errorMessage);
    } finally {
      setAddingProblems(prev => {
        const next = new Set(prev);
        next.delete(problemId);
        return next;
      });
    }
  };

  const handleAddAllProblems = async () => {
    if (!selectedListId) {
      alert('Please select a list first');
      return;
    }

    if (problems.length === 0) return;

    try {
      setAddingAll(true);
      let successCount = 0;
      let failCount = 0;

      // Add problems in batches to avoid overwhelming the server
      for (const problem of problems) {
        try {
          await dsaApi.addProblem(selectedListId, problem._id);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to add problem ${problem._id}:`, error);
        }
      }

      // Reload lists to get updated problem counts
      await loadLists();
      
      alert(`Added ${successCount} problem${successCount !== 1 ? 's' : ''} to list${failCount > 0 ? ` (${failCount} failed)` : ''}`);
    } catch (error) {
      console.error('Failed to add all problems:', error);
      alert('Failed to add some problems. Please try again.');
    } finally {
      setAddingAll(false);
    }
  };

  const isProblemInList = (problemId: string, listId: string): boolean => {
    const list = lists.find(l => l._id === listId);
    return list ? list.problemIds.includes(problemId) : false;
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="text-blackver:text-blue-700 mb-6"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Problems by Company</h1>

          <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Google, Amazon, Microsoft"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., SDE, SWE"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-black text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searched && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Top {problems.length} Problems for {companyName} {role}
                </h2>
                {problems.length > 0 && (
                  <div className="flex items-center gap-4">
                    {lists.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <label htmlFor="list-select" className="text-sm font-medium text-gray-700">
                            Add to List:
                          </label>
                          <select
                            id="list-select"
                            value={selectedListId}
                            onChange={(e) => setSelectedListId(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                          >
                            {lists.map((list) => (
                              <option key={list._id} value={list._id}>
                                {list.name} ({list.problemIds.length} problems)
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={handleAddAllProblems}
                          disabled={addingAll || !selectedListId}
                          className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {addingAll ? 'Adding All...' : 'Add All to List'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => router.push('/dsa')}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Create a List First
                      </button>
                    )}
                  </div>
                )}
              </div>
              {problems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No problems found. Try a different company or role.
                </div>
              ) : (
                <div className="space-y-4">
                  {problems.map((problem, index) => {
                    const isInSelectedList = selectedListId ? isProblemInList(problem._id, selectedListId) : false;
                    const isAdding = addingProblems.has(problem._id);
                    
                    return (
                      <div key={problem._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/dsa/problems/${problem._id}`}
                            className="flex-1 hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                ID: {problem.frontendQuestionId} • {problem.titleSlug}
                                {problem.acRate && ` • ${problem.acRate.toFixed(1)}% acceptance`}
                              </p>
                              <div className="flex items-center space-x-4">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded ${
                                    problem.difficulty === 'Easy'
                                      ? 'bg-green-100 text-green-800'
                                      : problem.difficulty === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                                {problem.paidOnly && (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                    Premium
                                  </span>
                                )}
                                {problem.topicTags && problem.topicTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {problem.topicTags.map((tag, idx) => (
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
                            </div>
                          </Link>
                          {lists.length > 0 && (
                            <div className="ml-4 flex flex-col gap-2">
                              {isInSelectedList ? (
                                <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded">
                                  In List
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddProblem(problem._id);
                                  }}
                                  disabled={isAdding || !selectedListId}
                                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                                >
                                  {isAdding ? 'Adding...' : 'Add to List'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

