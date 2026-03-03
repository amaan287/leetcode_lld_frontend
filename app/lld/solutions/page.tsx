'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { lldApi } from '@/lib/api/lld';
import { LLDQuestion } from '@/types';

export default function LLDSolutionsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [questions, setQuestions] = useState<LLDQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth/login');
            return;
        }
        loadQuestions();
    }, [isAuthenticated, router]);

    const loadQuestions = async () => {
        try {
            setLoading(false); // Assume we fetch all and filter
            const data = await lldApi.getQuestions();
            // In a real app, we might want an endpoint specifically for "questions with solutions"
            // but for now we'll just show all since we imported solutions for most.
            setQuestions(data);
        } catch (error) {
            console.error('Failed to load questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Official LLD Solutions
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Master low-level design by studying battle-tested implementations of common system design patterns.
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-xl mx-auto mb-12">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search solutions (e.g. Parking Lot, Vending Machine...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all group-hover:border-gray-300 dark:group-hover:border-gray-700 text-gray-900 dark:text-white"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-white dark:bg-[#1a1a1a] rounded-3xl animate-pulse border border-gray-100 dark:border-gray-800"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredQuestions.map((question) => (
                                <Link
                                    key={question._id}
                                    href={`/lld/questions/${question._id}?tab=solution`}
                                    className="group relative bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-start overflow-hidden"
                                >
                                    {/* Decorative background gradient */}
                                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${question.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                            }`}>
                                            {question.difficulty}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {question.category}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {question.title}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                                        {question.scenario.substring(0, 120)}...
                                    </p>

                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide">
                                        <span>EXPLORE SOLUTION</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && filteredQuestions.length === 0 && (
                        <div className="text-center py-24">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No solutions found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try searching for something else like "Logging" or "ATM".</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
