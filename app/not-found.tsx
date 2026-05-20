'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-md w-full text-center p-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl animate-in fade-in zoom-in duration-500">
        
        {/* Animated Pulse Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
          <AlertCircle className="text-red-500 w-12 h-12 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping opacity-75"></div>
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold mb-4 border border-red-200 dark:border-red-900/30">
          Error Code 404
        </span>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Oops! <span className="text-red-500">You've lost your way in the queue.</span>
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          The medical files, tutor profile, or booking queue page you are trying to access does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Back Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
