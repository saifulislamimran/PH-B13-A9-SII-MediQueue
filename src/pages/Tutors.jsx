import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTutors } from '../data/mockTutors';
import useDocumentTitle from '../hooks/useDocumentTitle';
import TutorCard from '../components/TutorCard';

export default function Tutors() {
  useDocumentTitle('Browse Tutors');
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [priceSort, setPriceSort] = useState('none');
  const [selectedDate, setSelectedDate] = useState('');

  // Extract unique subjects across all tutors
  const allSubjects = useMemo(() => {
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const subjects = new Set();
    [...customTutors, ...mockTutors].forEach((tutor) => {
      tutor.subjects.forEach((sub) => subjects.add(sub));
    });
    return ['All', ...Array.from(subjects)];
  }, []);

  // Filter and Sort Logic
  const filteredTutors = useMemo(() => {
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    let result = [...customTutors, ...mockTutors].filter(t => t.status !== 'pending');

    // 1. Text Search query (matches name or subject tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(query) ||
          tutor.subjects.some((sub) => sub.toLowerCase().includes(query)) ||
          tutor.institution.toLowerCase().includes(query)
      );
    }

    // 2. Subject filter
    if (selectedSubject !== 'All') {
      result = result.filter((tutor) =>
        tutor.subjects.includes(selectedSubject)
      );
    }

    // 3. Mock Date Filter
    if (selectedDate) {
      const day = new Date(selectedDate).getDay();
      // Mock: Dr. Sarah Johnson is not available on Sundays (day 0)
      if (day === 0) {
        result = result.filter((t = {}) => t.id !== 'tutor-1');
      }
      // Mock: Dr. Emily Blunt is not available on Saturdays (day 6)
      if (day === 6) {
        result = result.filter((t = {}) => t.id !== 'tutor-5');
      }
    }

    // 4. Sort by Price
    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedSubject, priceSort, selectedDate]);

  const handleBookSession = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setPriceSort('none');
    setSelectedDate('');
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-display-lg text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Medical Tutors
          </h1>
          <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300">
            Filter by clinical discipline, rates, and schedule availability to queue your session.
          </p>
        </div>

        {/* Filter Bar Controls Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-sm mb-10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-gray-300">
                search
              </span>
              <input
                type="text"
                placeholder="Search name or subject..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subject Selector */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white appearance-none font-semibold cursor-pointer outline-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="All">All Specialties</option>
                {allSubjects.filter(sub => sub !== 'All').map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Date availability filter */}
            <div className="relative">
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-semibold cursor-pointer outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Sort by Price */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white appearance-none font-semibold cursor-pointer outline-none"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="none">Sort by Hourly Rate</option>
                <option value="asc">Rate: Low to High</option>
                <option value="desc">Rate: High to Low</option>
              </select>
            </div>

          </div>

          {/* Active Filter Clear Tag */}
          {(searchQuery || selectedSubject !== 'All' || priceSort !== 'none' || selectedDate) && (
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10 dark:border-slate-700">
              <span className="text-xs font-semibold text-primary dark:text-primary-fixed-dim">
                Found {filteredTutors.length} matching tutors
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-error hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Tutors Grid Render */}
        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                onBook={handleBookSession}
              />
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-outline-variant/50 dark:border-slate-700 max-w-md mx-auto p-8 shadow-sm">
            <span className="material-symbols-outlined text-outline text-6xl mb-4 animate-bounce">
              person_search
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Tutors Match Your Filters</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              We couldn't find any medical instructors fitting your current search parameters. Try clearing your date selection or adjusting specialties.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-primary text-on-secondary rounded-full font-semibold text-sm hover:opacity-90 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
