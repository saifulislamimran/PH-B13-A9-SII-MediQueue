'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  School, 
  Trash2, 
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { mockTutors } from '../../src/data/mockTutors';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [tutorsList, setTutorsList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Load data from localStorage on mount (safe for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined') {
        const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
        const allTutors = [...customTutors, ...mockTutors];
        setTutorsList(allTutors);

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        setBookingsList(bookings);
      }
    } catch (err) {
      console.error("Failed to load admin data from localStorage:", err);
    }
  }, []);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const tutorCount = tutorsList ? tutorsList.length : 0;
    const totalBookings = bookingsList ? bookingsList.length : 0;
    const scheduled = bookingsList ? bookingsList.filter(b => b && b.status === 'Scheduled').length : 0;
    const rescheduled = bookingsList ? bookingsList.filter(b => b && b.status === 'Rescheduled').length : 0;
    
    const sumPrice = tutorsList
      ? tutorsList.reduce((acc, curr) => {
          const priceVal = curr && curr.price ? Number(curr.price) : 0;
          return acc + (isNaN(priceVal) ? 0 : priceVal);
        }, 0)
      : 0;
    const avgPrice = tutorCount > 0 ? (sumPrice / tutorCount).toFixed(1) : '0';

    // Specialty Subject distribution
    const subjectDistribution: { [key: string]: number } = {};
    if (tutorsList) {
      tutorsList.forEach(t => {
        if (t && t.subjects && Array.isArray(t.subjects)) {
          t.subjects.forEach((sub: string) => {
            if (sub) {
              subjectDistribution[sub] = (subjectDistribution[sub] || 0) + 1;
            }
          });
        }
      });
    }

    const uniqueInstitutions = new Set(
      tutorsList 
        ? tutorsList.map(t => t && t.institution ? t.institution : '').filter(Boolean) 
        : []
    );

    return {
      tutorCount,
      totalBookings,
      scheduled,
      rescheduled,
      avgPrice,
      subjectDistribution,
      institutionCount: uniqueInstitutions.size
    };
  }, [tutorsList, bookingsList]);

  // Handler to delete a tutor (only from local storage)
  const handleDeleteTutor = (tutorId: string | number) => {
    if (confirm('Are you sure you want to remove this tutor listing?')) {
      try {
        const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
        const updatedCustom = customTutors.filter((t: any) => t && t.id !== tutorId);
        localStorage.setItem('customTutors', JSON.stringify(updatedCustom));
        
        // Update local state
        setTutorsList([...updatedCustom, ...mockTutors]);
      } catch (err) {
        console.error("Failed to delete tutor:", err);
      }
    }
  };

  // Filtered tutors list
  const filteredTutors = useMemo(() => {
    if (!tutorsList) return [];
    return tutorsList.filter(tutor => {
      if (!tutor) return false;
      const name = tutor.name || '';
      const institution = tutor.institution || '';
      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institution.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = 
        subjectFilter === 'All' || 
        (tutor.subjects && Array.isArray(tutor.subjects) && tutor.subjects.includes(subjectFilter));

      return matchesSearch && matchesSubject;
    });
  }, [tutorsList, searchQuery, subjectFilter]);

  // Get unique subject list for filters
  const allSubjects = useMemo(() => {
    const subjectsSet = new Set<string>();
    if (tutorsList) {
      tutorsList.forEach(t => {
        if (t && t.subjects && Array.isArray(t.subjects)) {
          t.subjects.forEach((s: string) => {
            if (s) subjectsSet.add(s);
          });
        }
      });
    }
    return Array.from(subjectsSet);
  }, [tutorsList]);

  if (!mounted) {
    return (
      <div className="py-8 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-105 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold mb-2">
            System Operations Panel
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Operations & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor real-time tutor metrics, bookings distribution, and discipline coverage.
          </p>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Tutors */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Active Tutors</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tutorCount}</span>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Reservations</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</span>
          </div>
        </div>

        {/* Card 3: Average Price */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Average Rate</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${stats.avgPrice}/hr</span>
          </div>
        </div>

        {/* Card 4: Universities */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Universities</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.institutionCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Table & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Manage Tutors Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Manage Tutor Catalog
            </h2>
            
            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name/college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-650 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-600 text-gray-900 dark:text-white"
                />
              </div>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-650 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-600 text-gray-900 dark:text-white"
              >
                <option value="All">All Subjects</option>
                {allSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-100 dark:border-slate-750 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-750 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 dark:border-slate-750">
                  <th className="p-4">Tutor Profile</th>
                  <th className="p-4">Primary College</th>
                  <th className="p-4">Hourly Rate</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-750">
                {filteredTutors.length > 0 ? (
                  filteredTutors.map((tutor) => (
                    <tr key={tutor.id || Math.random().toString()} className="hover:bg-gray-50/50 dark:hover:bg-slate-750/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={tutor.image || 'https://via.placeholder.com/150'} 
                            alt={tutor.name || 'Tutor'} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-650"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{tutor.name || 'Anonymous Tutor'}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {tutor.subjects?.slice(0, 2).map((s: string) => (
                                <span key={s} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[9px] font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-gray-600 dark:text-gray-300 font-medium">
                        {tutor.institution || 'Independent'}
                      </td>
                      <td className="p-4 align-middle font-bold text-gray-900 dark:text-white">
                        ${tutor.price || 0}/hr
                      </td>
                      <td className="p-4 align-middle text-center">
                        <button
                          onClick={() => handleDeleteTutor(tutor.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No instructors match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Share Distribution */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              Specialty Coverage
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Percentage breakdown of tutors across medical topics.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.subjectDistribution).map(([subject, count]) => {
              const percentage = stats.tutorCount > 0 ? ((count / stats.tutorCount) * 100).toFixed(0) : 0;
              return (
                <div key={subject} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-700 dark:text-gray-300">{subject}</span>
                    <span className="text-blue-600 dark:text-blue-400">{count} tutors ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
