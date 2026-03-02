'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { dsaApi } from '@/lib/api/dsa';
import { DSAProblem, DSASolution } from '@/types';
import CodeEditor from '@/components/CodeEditor';

const LANGUAGES = [
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'TypeScript', value: 'typescript' },
];

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const problemId = params.id as string;
  const [problem, setProblem] = useState<DSAProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [submittedSolution, setSubmittedSolution] = useState<DSASolution | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

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

  const handleRun = async () => {
    if (!answer.trim()) return;

    try {
      setRunning(true);
      setValidationResult(null);
      const result = await dsaApi.checkCode(problemId, answer, selectedLanguage);
      setValidationResult(result);
    } catch (error) {
      console.error('Failed to run code:', error);
      alert('Failed to check code. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      setSubmitting(true);
      const result = await dsaApi.submitSolution(problemId, answer, selectedLanguage);
      setSubmittedSolution(result);
      setValidationResult(null);
    } catch (error) {
      console.error('Failed to submit solution:', error);
      alert('Failed to submit solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated() || loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
          <div className="text-gray-900 dark:text-white">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!problem) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">
          <div className="text-gray-900 dark:text-white">Problem not found</div>
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
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const leetcodeUrl = `https://leetcode.com/problems/${problem.titleSlug}`;

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col transition-colors duration-300">
        {/* Main Content Area - Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#282828] border-r border-gray-200 dark:border-[#3c3c3c]">
            <div className="max-w-3xl mx-auto px-6 py-4">
              {/* Header */}
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="text-gray-500 dark:text-[#b3b3b3] hover:text-black dark:hover:text-white mb-4 text-sm flex items-center gap-1 transition-colors"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)} px-2 py-0.5 rounded`}>
                    {problem.difficulty}
                  </span>
                  {problem.acRate && (
                    <>
                      <span className="text-sm text-gray-500 dark:text-[#b3b3b3]">•</span>
                      <span className="text-sm text-gray-500 dark:text-[#b3b3b3]">AC Rate: {problem.acRate.toFixed(1)}%</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {problem.frontendQuestionId}. {problem.title}
                </h1>
              </div>

              {/* Problem Content */}
              <div className="space-y-6 text-gray-600 dark:text-[#b3b3b3]">
                {problem.topicTags && problem.topicTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {problem.topicTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-[#323232] text-gray-600 dark:text-[#b3b3b3] rounded"
                      >
                        {tag.name || tag.slug}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {problem.description && (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {problem.description}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Examples</h3>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-[#323232] rounded-lg p-4 border border-gray-100 dark:border-[#3c3c3c]">
                        <p className="text-xs font-bold text-gray-500 dark:text-[#888] mb-2 uppercase tracking-wider">Example {i + 1}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Input: </span>
                            <code className="text-xs bg-gray-200 dark:bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#d16d9e] dark:text-[#ce9178]">{ex.input}</code>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Output: </span>
                            <code className="text-xs bg-gray-200 dark:bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#d16d9e] dark:text-[#ce9178]">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className="text-xs text-gray-600 dark:text-[#b3b3b3] mt-2 italic">
                              <span className="font-semibold not-italic">Explanation: </span>
                              {ex.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-[#b3b3b3]">
                          <code className="bg-gray-100 dark:bg-[#323232] px-1.5 py-0.5 rounded">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 dark:border-[#3c3c3c]">
                  <a
                    href={leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Original on LeetCode
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-full lg:w-[600px] xl:w-[750px] flex flex-col bg-gray-50 dark:bg-[#1e1e1e] border-t lg:border-t-0 border-l border-gray-200 dark:border-[#3c3c3c]">
            {!submittedSolution ? (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#3c3c3c] bg-gray-100 dark:bg-[#252526]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#3c3c3c] text-gray-900 dark:text-white text-xs rounded px-2 py-1 focus:outline-none transition-colors"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  <CodeEditor
                    value={answer}
                    onChange={(val) => setAnswer(val || '')}
                    language={selectedLanguage}
                  />
                </div>

                {/* Run Results / Status Area */}
                {validationResult && (
                  <div className={`px-4 py-3 border-t ${validationResult.valid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-semibold ${validationResult.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {validationResult.valid ? '✓ Code validation passed' : '✗ Potential issues found'}
                      </span>
                    </div>
                    {validationResult.errors.length > 0 && (
                      <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                        {validationResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Submit / Run Buttons */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-[#3c3c3c] bg-gray-100 dark:bg-[#252526] flex gap-3">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={running || submitting || !answer.trim()}
                    className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-[#3c3c3c] hover:bg-gray-300 dark:hover:bg-[#4a4a4a] text-gray-900 dark:text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {running ? 'Checking...' : 'Run / Check'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || running || !answer.trim()}
                    className="flex-1 px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Rating'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col h-full">
                {/* Result Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#3c3c3c] bg-gray-100 dark:bg-[#252526]">
                  <span className="text-sm text-gray-600 dark:text-[#b3b3b3]">Solution Result</span>
                  <span className="text-xs text-gray-500 dark:text-[#888]">{submittedSolution.language}</span>
                </div>

                {/* Result Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Submitted Solution */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Your Solution</h3>
                    <div className="h-[350px] w-full rounded-md overflow-hidden">
                      <CodeEditor
                        value={submittedSolution.solution}
                        onChange={() => { }}
                        language={selectedLanguage}
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  {submittedSolution.rating && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Rating</h3>
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">{submittedSolution.rating}</div>
                        <div className="text-lg text-gray-500 dark:text-[#b3b3b3]">/ 10</div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {submittedSolution.feedback && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Analysis & Feedback</h3>
                      <div className="bg-blue-50 dark:bg-[#1e3a5f] border border-blue-200 dark:border-[#2d5a8a] rounded-md p-4 transition-colors">
                        <div className="text-sm text-blue-900 dark:text-[#b3d4fc] leading-relaxed whitespace-pre-wrap font-sans">
                          {submittedSolution.feedback}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reset Button */}
                  <div className="pt-4 pb-8">
                    <button
                      onClick={() => {
                        setSubmittedSolution(null);
                        setAnswer('');
                        setValidationResult(null);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-200 dark:bg-[#3c3c3c] hover:bg-gray-300 dark:hover:bg-[#4a4a4a] text-gray-900 dark:text-white font-medium rounded-md transition-colors"
                    >
                      Try Another Solution
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
