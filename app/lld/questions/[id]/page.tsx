'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { lldApi } from '@/lib/api/lld';
import { LLDQuestion, LLDAnswer } from '@/types';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const questionId = params.id as string;
  const [question, setQuestion] = useState<LLDQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState<LLDAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      setSubmitting(true);
      const result = await lldApi.submitAnswer(questionId, answer);
      setSubmittedAnswer(result);
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
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!question) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-white">Question not found</div>
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
        return 'text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        {/* Main Content Area - Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Question Description */}
          <div className="flex-1 overflow-y-auto bg-[#282828] border-r border-[#3c3c3c]">
            <div className="max-w-3xl mx-auto px-6 py-4">
              {/* Header */}
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="text-[#b3b3b3] hover:text-white mb-4 text-sm flex items-center gap-1 transition-colors"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="text-sm text-[#b3b3b3]">•</span>
                  <span className="text-sm text-[#b3b3b3]">{question.category}</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mb-6">{question.title}</h1>
              </div>

              {/* Question Content */}
              <div className="space-y-6 text-[#b3b3b3]">
                {question.scenario && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-3">Scenario</h2>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {question.scenario}
                    </div>
                  </div>
                )}
                {question.description && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {question.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col bg-[#1e1e1e] border-t lg:border-t-0 border-l border-[#3c3c3c]">
            {!submittedAnswer ? (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#3c3c3c] bg-[#252526]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#b3b3b3]">Solution</span>
                  </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none focus:outline-none border-none"
                    placeholder="// Write your solution here..."
                    required
                    style={{ tabSize: 2 }}
                  />
                </div>

                {/* Submit Button */}
                <div className="px-4 py-3 border-t border-[#3c3c3c] bg-[#252526]">
                  <button
                    type="submit"
                    disabled={submitting || !answer.trim()}
                    className="w-full px-4 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Rating'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col h-full">
                {/* Result Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#3c3c3c] bg-[#252526]">
                  <span className="text-sm text-[#b3b3b3]">Solution Result</span>
                </div>

                {/* Result Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Submitted Answer */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Your Solution</h3>
                    <div className="bg-[#252526] rounded-md p-4 border border-[#3c3c3c]">
                      <pre className="text-sm text-[#d4d4d4] font-mono whitespace-pre-wrap leading-relaxed">
                        {submittedAnswer.answer}
                      </pre>
                    </div>
                  </div>

                  {/* Rating */}
                  {submittedAnswer.rating && (
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">Rating</h3>
                      <div className="flex items-baseline gap-3">
                        <div className="text-5xl font-bold text-white">{submittedAnswer.rating}</div>
                        <div className="text-lg text-[#b3b3b3]">/ 10</div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {submittedAnswer.feedback && (
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">Feedback</h3>
                      <div className="bg-[#1e3a5f] border border-[#2d5a8a] rounded-md p-4">
                        <p className="text-sm text-[#b3d4fc] leading-relaxed whitespace-pre-wrap">
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
                      className="w-full px-4 py-2.5 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-white font-medium rounded-md transition-colors"
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

