
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 bg-gradient-to-br from-surface to-surface-container-high dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-md w-full text-center p-10 bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl shadow-xl animate-in fade-in zoom-in duration-500">
        
        {/* Animated Pulse Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full bg-error-container/30 dark:bg-error-container/10">
          <span className="material-symbols-outlined text-error text-5xl animate-pulse">
            running_with_errors
          </span>
          <div className="absolute inset-0 rounded-full border-2 border-error/20 animate-ping opacity-75"></div>
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-error/10 text-error font-label-md text-label-md mb-4 border border-error/20">
          Error Code 404
        </span>

        <h1 className="text-3xl font-display-lg font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Diagnosis: <span className="text-error">Page Not Found</span>
        </h1>

        <p className="text-body-md text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          The medical files, tutor profile, or booking queue page you are trying to access does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-on-secondary rounded-full font-semibold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
