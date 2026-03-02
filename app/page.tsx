'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dsa');
    }
  }, [isAuthenticated, router]);

  // Don't render the home page if user is authenticated (redirecting)
  if (isAuthenticated()) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-7xl md:text-8xl tracking-tighter">
              <span className="block mb-2">Master DSA & LLD</span>
              <span className="block bg-gradient-to-r from-gray-700 to-black dark:from-gray-300 dark:to-white bg-clip-text text-transparent"> Practice & Learn</span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:text-2xl leading-relaxed">
              Create custom problem lists, track your progress, and get <span className="text-black dark:text-white font-semibold">AI-powered feedback</span> on your LLD solutions.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-full shadow-lg">
                <Link
                  href="/auth/register"
                  className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-black dark:bg-white dark:text-black hover:scale-105 transition-all duration-300"
                >
                  Get started
                </Link>
              </div>
              <div className="mt-3 rounded-full shadow-lg sm:mt-0 sm:ml-4">
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center px-10 py-4 border border-gray-200 dark:border-gray-800 text-lg font-bold rounded-full text-black dark:text-white bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              <div className="pt-6">
                <div className="group relative flow-root bg-white dark:bg-gray-900/50 rounded-2xl px-8 pb-10 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 -mt-8">
                    <div className="inline-flex items-center justify-center p-4 bg-black dark:bg-white rounded-2xl shadow-2xl transform transition-transform group-hover:rotate-6">
                      <svg className="h-8 w-8 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      DSA Practice
                    </h3>
                    <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                      Create custom problem lists, search by company, and track your progress. Mark problems as done and organize your learning journey.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="group relative flow-root bg-white dark:bg-gray-900/50 rounded-2xl px-8 pb-10 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 -mt-8">
                    <div className="inline-flex items-center justify-center p-4 bg-black dark:bg-white rounded-2xl shadow-2xl transform transition-transform group-hover:-rotate-6">
                      <svg className="h-8 w-8 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      LLD Practice
                    </h3>
                    <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                      Practice machine coding round questions. Submit your solutions and get AI-powered ratings and feedback to improve your design skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
