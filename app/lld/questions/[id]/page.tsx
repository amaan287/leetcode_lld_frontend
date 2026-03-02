'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { lldApi } from '@/lib/api/lld';
import { LLDQuestion, LLDAnswer } from '@/types';
import CodeEditor from '@/components/CodeEditor';

const LANGUAGES = [
  { label: 'Java', value: 'java' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'cpp' },
];

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const questionId = params.id as string;
  const [question, setQuestion] = useState<LLDQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [submittedAnswer, setSubmittedAnswer] = useState<LLDAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadQuestion();
  }, [questionId, isAuthenticated, router]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await lldApi.getQuestion(questionId);
      setQuestion(data);
    } catch (error: any) {
      console.error('Failed to load question:', error);
      if (error.response?.status === 404) {
        alert('Question not found');
        router.push('/lld');
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
      const result = await lldApi.checkCode(questionId, answer);
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
      const result = await lldApi.submitAnswer(questionId, answer);
      setSubmittedAnswer(result);
      setValidationResult(null);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated() || loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center transition-colors duration-300">
          <div className="text-gray-900 dark:text-white">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!question) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center transition-colors duration-300">
          <div className="text-gray-900 dark:text-white">Question not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-[#00b8a3]';
      case 'Medium':
        return 'text-[#ffc01e]';
      case 'Hard':
        return 'text-[#ff375f]';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col transition-colors duration-300">
        {/* Main Content Area - Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Question Description */}
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
                  <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-[#b3b3b3]">•</span>
                  <span className="text-sm text-gray-500 dark:text-[#b3b3b3]">{question.category}</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{question.title}</h1>
              </div>

              {/* Question Content */}
              <div className="space-y-6 text-gray-600 dark:text-[#b3b3b3]">
                {question.scenario && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Scenario</h2>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {question.scenario}
                    </div>
                  </div>
                )}
                {question.description && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {question.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col bg-gray-50 dark:bg-[#1e1e1e] border-t lg:border-t-0 border-l border-gray-200 dark:border-[#3c3c3c]">
            {!submittedAnswer ? (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#3c3c3c] bg-gray-100 dark:bg-[#252526]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solution</span>
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
                        {validationResult.valid ? '✓ Code looks valid' : '✗ Potential issues found'}
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
                    {running ? 'Running...' : 'Run / Check'}
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
                </div>

                {/* Result Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Submitted Answer */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Your Solution</h3>
                    <div className="h-[400px] w-full rounded-md overflow-hidden">
                      <CodeEditor
                        value={submittedAnswer.answer}
                        onChange={() => { }}
                        language={selectedLanguage}
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  {submittedAnswer.rating && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Rating</h3>
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">{submittedAnswer.rating}</div>
                        <div className="text-lg text-gray-500 dark:text-[#b3b3b3]">/ 10</div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {submittedAnswer.feedback && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Feedback</h3>
                      <div className="bg-blue-50 dark:bg-[#1e3a5f] border border-blue-200 dark:border-[#2d5a8a] rounded-md p-4 transition-colors">
                        <p className="text-sm text-blue-800 dark:text-[#b3d4fc] leading-relaxed whitespace-pre-wrap">
                          {submittedAnswer.feedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reset Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmittedAnswer(null);
                        setAnswer('');
                      }}
                      className="w-full px-4 py-2.5 bg-gray-200 dark:bg-[#3c3c3c] hover:bg-gray-300 dark:hover:bg-[#4a4a4a] text-gray-900 dark:text-white font-medium rounded-md transition-colors"
                    >
                      Submit New Answer
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

