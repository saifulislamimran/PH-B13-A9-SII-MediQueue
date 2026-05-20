import React, { useMemo } from 'react';
import { mockTutors } from '../data/mockTutors';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AdminDashboard() {
  useDocumentTitle('System Metrics');

  // Compute Metrics dynamically
  const stats = useMemo(() => {
    // 1. Tutors Count
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const totalTutors = [...customTutors, ...mockTutors];
    const tutorCount = totalTutors.length;
    const customCount = customTutors.length;

    // 2. Bookings Counts
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const totalBookings = bookings.length;
    const scheduled = bookings.filter(b => b.status === 'Scheduled').length;
    const rescheduled = bookings.filter(b => b.status === 'Rescheduled').length;
    
    // 3. Average Price
    const sumPrice = totalTutors.reduce((acc, curr) => acc + curr.price, 0);
    const avgPrice = tutorCount > 0 ? (sumPrice / tutorCount).toFixed(1) : 0;

    // 4. Specialty Subject distribution
    const subjectDistribution = {};
    totalTutors.forEach(t => {
      t.subjects.forEach(sub => {
        subjectDistribution[sub] = (subjectDistribution[sub] || 0) + 1;
      });
    });

    // 5. Total unique institutions
    const uniqueInstitutions = new Set(totalTutors.map(t => t.institution));

    return {
      tutorCount,
      customCount,
      totalBookings,
      scheduled,
      rescheduled,
      avgPrice,
      subjectDistribution,
      institutionCount: uniqueInstitutions.size
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-bold mb-3">
            System Operations Panel
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Operations & Analytics</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Live monitor metrics mapping student demands, active course reservations, and catalog pricing averages.
          </p>
        </div>

        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Total Tutors */}
          <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">groups</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Active Instructors</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.tutorCount}</span>
              <span className="text-[10px] text-primary dark:text-primary-fixed-dim block font-semibold">({stats.customCount} user-added)</span>
            </div>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">event_available</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Total Reservations</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.totalBookings}</span>
              <span className="text-[10px] text-secondary block font-semibold">
                ({stats.scheduled} scheduled, {stats.rescheduled} rescheduled)
              </span>
            </div>
          </div>

          {/* Card 3: Avg Hourly Rate */}
          <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Avg Tutor Rate</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${stats.avgPrice}</span>
              <span className="text-[10px] text-green-600 block font-semibold">/ hour base</span>
            </div>
          </div>

          {/* Card 4: Institutions */}
          <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">account_balance</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Universities & Clinics</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.institutionCount}</span>
              <span className="text-[10px] text-amber-600 block font-semibold">represented</span>
            </div>
          </div>

        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Specialty Subject Distribution */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">pie_chart</span>
              Specialty Coverage Share
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.subjectDistribution).map(([subject, count]) => {
                const percentage = stats.tutorCount > 0 ? ((count / stats.tutorCount) * 100).toFixed(0) : 0;
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-700 dark:text-gray-200">{subject}</span>
                      <span className="text-primary dark:text-primary-fixed-dim">{count} Tutors ({percentage}%)</span>
                    </div>
                    {/* SVG progress bar */}
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 relative overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Audit Information */}
          <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">gavel</span>
              Operational Logs
            </h2>
            
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-outline-variant/30 dark:border-slate-700">
                <span className="font-bold text-primary dark:text-primary-fixed-dim block mb-1">JWT Security Validation</span>
                <p className="text-gray-600 dark:text-gray-300">
                  Axios interceptor binds dynamic Authorization Bearer headers to all incoming/outgoing service loops.
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-outline-variant/30 dark:border-slate-700">
                <span className="font-bold text-primary dark:text-primary-fixed-dim block mb-1">Firebase Syncing status</span>
                <p className="text-gray-600 dark:text-gray-300">
                  Initial observer active. Client cache retains secure token details to bypass page reload redirection events.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
