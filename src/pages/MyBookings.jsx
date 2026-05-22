import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MyBookings() {
  useDocumentTitle('My Dashboard');
  const { user } = useAuth();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'tutors'

  // Booking & Tutor Data States
  const [bookings, setBookings] = useState([]);
  const [myTutors, setMyTutors] = useState([]);

  // Reschedule Modal States
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');

  // Review Modal States
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewTutorId, setReviewTutorId] = useState('');
  const [reviewTutorName, setReviewTutorName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Load user data on mount
  useEffect(() => {
    if (user && user.role === 'student') {
      setActiveTab('bookings');
    }
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;

    // Load and filter bookings by current user email
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b) => b.studentEmail === user.email);
    setBookings(userBookings);

    // Load and filter tutors listed by current user email
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const userTutors = customTutors.filter((t) => t.email === user.email);
    setMyTutors(userTutors);
  };

  // Cancel Booking Action
  const handleCancelBooking = (bookingId, tutorName) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel your session with ${tutorName}?`);
    if (!confirmCancel) return;

    try {
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = allBookings.filter((b) => b.bookingId !== bookingId);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      
      toast.success('Session cancelled successfully.');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel session.');
    }
  };

  // Open Reschedule Modal
  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.appointmentDate);
    setNewTime(booking.appointmentTime);
    setIsRescheduleOpen(true);
  };

  // Submit Reschedule Change
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) {
      toast.error('Please specify an appointment date.');
      return;
    }

    try {
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = allBookings.map((b) => {
        if (b.bookingId === selectedBooking.bookingId) {
          return {
            ...b,
            appointmentDate: newDate,
            appointmentTime: newTime,
            status: 'Rescheduled'
          };
        }
        return b;
      });

      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      toast.success('Session rescheduled successfully.');
      setIsRescheduleOpen(false);
      setSelectedBooking(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reschedule session.');
    }
  };

  // Open Review Modal
  const openReviewModal = (tutorId, tutorName) => {
    setReviewTutorId(tutorId);
    setReviewTutorName(tutorName);
    setRating(5);
    setReviewText('');
    setIsReviewOpen(true);
  };

  // Submit Review Feedback
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error('Please enter a review message.');
      return;
    }

    try {
      // Mock review persistence. In production, this would save to a review database.
      // Here, we simulate review confirmation and update the tutor rating.
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      
      const updatedTutors = customTutors.map((t) => {
        if (t.id === reviewTutorId) {
          const newCount = t.reviewsCount + 1;
          const newRating = parseFloat(((t.rating * t.reviewsCount + rating) / newCount).toFixed(1));
          return { ...t, rating: newRating, reviewsCount: newCount };
        }
        return t;
      });

      localStorage.setItem('customTutors', JSON.stringify(updatedTutors));
      toast.success(`Thank you for reviewing ${reviewTutorName}!`);
      setIsReviewOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile dashboard header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12 border-b border-outline-variant/30 dark:border-slate-700 pb-8">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <img alt={user.displayName} className="w-full h-full object-cover" src={user.photoURL} />
              ) : (
                <span className="material-symbols-outlined text-primary text-3xl">person</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName || 'Student Account'}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{user.email}</p>
            </div>
          </div>
          
          {/* Create Tutor Shortcut */}
          {user && (user.role === 'tutor' || user.role === 'admin') && (
            <Link
              to="/add-tutor"
              className="px-5 py-3 bg-primary text-on-secondary rounded-xl font-label-md text-label-md hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              List as a Tutor
            </Link>
          )}
        </div>

        {/* Tab Selection Row */}
        <div className="flex gap-4 mb-8 border-b border-outline-variant/20 dark:border-slate-700 pb-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-primary text-on-secondary'
                : 'text-gray-600 dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            My Booked Sessions ({bookings.length})
          </button>
          {user && (user.role === 'tutor' || user.role === 'admin') && (
            <button
              onClick={() => setActiveTab('tutors')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'tutors'
                  ? 'bg-primary text-on-secondary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">school</span>
              My Tutor Listings ({myTutors.length})
            </button>
          )}
        </div>

        {/* Tab 1 Content: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Tutor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                          {booking.tutorImage ? (
                            <img alt={booking.tutorName} className="w-full h-full object-cover" src={booking.tutorImage} />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-2xl">person</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{booking.tutorName}</h3>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold">
                            {booking.tutorInstitution}
                          </p>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl space-y-2 mb-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Subject:</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded font-semibold text-[10px]">
                            {booking.subject}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Date:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">{booking.appointmentDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Time Slot:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">{booking.appointmentTime}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Session Status:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            booking.status === 'Rescheduled'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {booking.note && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-4 line-clamp-2">
                          Note: "{booking.note}"
                        </p>
                      )}
                    </div>

                    {/* Actions Panel */}
                    <div className="flex gap-2 justify-end border-t border-outline-variant/10 dark:border-slate-700 pt-4 mt-2">
                      <button
                        onClick={() => openReviewModal(booking.tutorId, booking.tutorName)}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">rate_review</span>
                        Review
                      </button>
                      <button
                        onClick={() => openRescheduleModal(booking)}
                        className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-900/10 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId, booking.tutorName)}
                        className="px-3.5 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-outline-variant/30 dark:border-slate-700 max-w-sm mx-auto p-6 shadow-sm">
                <span className="material-symbols-outlined text-outline text-5xl mb-3">calendar_today</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Booked Sessions</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
                  You haven't scheduled any sessions with our medical instructors yet.
                </p>
                <Link to="/tutors" className="px-5 py-2 bg-primary text-on-secondary rounded-xl font-bold text-xs">
                  Find Tutors
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Tutors */}
        {activeTab === 'tutors' && user && user.role !== 'student' && (
          <div>
            {myTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                        {tutor.image ? (
                          <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-3xl">person</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{tutor.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">{tutor.institution}</p>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded font-semibold text-[10px]">
                          {tutor.subjects[0]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white block">${tutor.price}/hr</span>
                      <Link
                        to={`/tutor/${tutor.id}`}
                        className="text-xs font-bold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1 justify-end mt-2"
                      >
                        View Profile
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-outline-variant/30 dark:border-slate-700 max-w-sm mx-auto p-6 shadow-sm">
                <span className="material-symbols-outlined text-outline text-5xl mb-3">medical_services</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Not Registered as Tutor</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
                  Listing your skills connects you with medical students globally.
                </p>
                <Link to="/add-tutor" className="px-5 py-2 bg-primary text-on-secondary rounded-xl font-bold text-xs">
                  Register as Tutor
                </Link>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Reschedule Modal Overlay */}
      <AnimatePresence>
        {isRescheduleOpen && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 border border-outline-variant/30 dark:border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRescheduleOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reschedule Session</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-6">
                Update the schedule parameters for your session with {selectedBooking.tutorName}.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">New Appointment Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">New Time Slot</label>
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsRescheduleOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 transition-all"
                  >
                    Confirm Changes
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Feedback Modal */}
      <AnimatePresence>
        {isReviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 border border-outline-variant/30 dark:border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={() => setIsReviewOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Write a Review</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-6">
                Rate your educational session with {reviewTutorName} to help other medical students.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Select Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-primary dark:text-primary-fixed-dim"
                      >
                        <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' " + (star <= rating ? 1 : 0) }}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Your Feedback</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Share details of your experience, the tutor's style, and what you liked..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 transition-all"
                  >
                    Publish Review
                    <span className="material-symbols-outlined text-[14px]">publish</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
