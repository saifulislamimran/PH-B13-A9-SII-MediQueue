import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTutors } from '../data/mockTutors';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
    let result = [...customTutors, ...mockTutors];

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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-display-lg text-4xl font-bold text-on-surface mb-2">
            Browse Medical Tutors
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
            Filter by clinical discipline, rates, and schedule availability to queue your session.
          </p>
        </div>

        {/* Filter Bar Controls Panel */}
        <div className="bg-surface dark:bg-inverse-surface/30 p-6 rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm mb-10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search name or subject..."
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface dark:text-inverse-on-surface"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subject Selector */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface dark:text-inverse-on-surface appearance-none font-semibold cursor-pointer"
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
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface dark:text-inverse-on-surface font-semibold cursor-pointer"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Sort by Price */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface dark:text-inverse-on-surface appearance-none font-semibold cursor-pointer"
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
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
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
              <div
                key={tutor.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-6 tutor-card-shadow border border-outline-variant/30 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary-fixed-dim/30 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/10 shrink-0 relative bg-primary/5 flex items-center justify-center">
                    {tutor.image ? (
                      <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                    ) : (
                      <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-4xl">person</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
                      {tutor.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">
                      {tutor.institution}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-md text-label-md ml-1 font-semibold">
                        {tutor.rating} ({tutor.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                  {tutor.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-xs font-semibold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 h-10">
                  {tutor.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30 dark:border-white/10 mt-auto">
                  <span className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
                    ${tutor.price}
                    <span className="text-gray-500 dark:text-gray-400 text-label-md font-normal">/hr</span>
                  </span>
                  <button
                    onClick={() => handleBookSession(tutor.id)}
                    className="px-6 py-2.5 bg-primary text-on-secondary dark:bg-primary-container dark:text-on-primary-container rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-all active:scale-95"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="text-center py-20 bg-surface dark:bg-inverse-surface/10 rounded-3xl border border-dashed border-outline-variant/50 max-w-md mx-auto p-8 shadow-sm">
            <span className="material-symbols-outlined text-outline text-6xl mb-4 animate-bounce">
              person_search
            </span>
            <h3 className="text-xl font-bold text-on-surface mb-2">No Tutors Match Your Filters</h3>
            <p className="text-on-surface-variant dark:text-surface-variant mb-6 text-sm">
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
