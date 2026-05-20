import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockTutors } from '../data/mockTutors';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Find tutor by ID
  const tutor = (() => {
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    return [...customTutors, ...mockTutors].find((t) => t.id === id);
  })();
  useDocumentTitle(tutor ? `${tutor.name} Profile` : 'Tutor Details');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Booking Form States
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [selectedSubject, setSelectedSubject] = useState(tutor ? tutor.subjects[0] : '');
  const [studentNote, setStudentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tutor) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-surface-container-lowest">
        <span className="material-symbols-outlined text-outline text-6xl mb-4">person_off</span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Tutor Profile Not Found</h2>
        <p className="text-on-surface-variant dark:text-surface-variant mb-6 text-center max-w-sm">
          The medical instructor profile you are seeking might have been deactivated or has an incorrect web link.
        </p>
        <Link to="/tutors" className="px-6 py-2.5 bg-primary text-on-secondary rounded-xl font-semibold">
          Back to Tutors
        </Link>
      </div>
    );
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingDate('');
    setStudentNote('');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!bookingDate) {
      toast.error('Please pick a booking appointment date.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create new booking record structure
      const newBooking = {
        bookingId: `book-${Date.now()}`,
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorImage: tutor.image,
        tutorInstitution: tutor.institution,
        price: tutor.price,
        studentName: user.displayName || 'Student',
        studentEmail: user.email,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        subject: selectedSubject,
        note: studentNote,
        bookedAt: new Date().toISOString(),
        status: 'Scheduled'
      };

      // Retrieve existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      // Mock delay
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success(`Session with ${tutor.name} scheduled successfully!`);
        setIsModalOpen(false);
        // Redirect user to My Bookings dashboard
        navigate('/my-bookings');
      }, 800);

    } catch (err) {
      console.error(err);
      toast.error('Could not save reservation. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-900 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 text-primary dark:text-primary-fixed-dim hover:underline mb-8 font-semibold"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Tutors Catalog
        </Link>

        {/* Profile Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-outline-variant/30 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
                  {tutor.image ? (
                    <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                  ) : (
                    <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-6xl">person</span>
                  )}
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-xs font-bold">
                    Verified Instructor
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tutor.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">
                    {tutor.institution}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start text-primary dark:text-primary-fixed-dim">
                    <span className="material-symbols-outlined text-lg fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-semibold ml-1 text-gray-900 dark:text-white">{tutor.rating} ({tutor.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 dark:border-slate-700 pt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About Tutor</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {tutor.description}
                </p>
              </div>

              <div className="border-t border-outline-variant/30 dark:border-slate-700 pt-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Specialty Disciplines</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 rounded-xl text-sm font-semibold border border-blue-100 dark:border-blue-800/40"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Reviews Section */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-outline-variant/30 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Student Feedback</h2>
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 dark:border-slate-700 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Michael R. (USMLE Student)</span>
                    <div className="flex text-primary dark:text-primary-fixed-dim">
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Exceptional tutor. Simplified complex physiological processes into simple visual concepts that I had struggled with for weeks."
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">Lisa K. (MS-2)</span>
                    <div className="flex text-primary dark:text-primary-fixed-dim">
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Very patient. Helped me review mock board questions step-by-step and taught me how to read clinical vignettes efficiently."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-outline-variant/30 dark:border-slate-700 shadow-sm space-y-6 lg:sticky lg:top-24">
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-1">Session Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${tutor.price}</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">/ hour</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/30 dark:border-slate-700">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl">schedule</span>
                <span>Average response: <strong>2 hours</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl">language</span>
                <span>Instruction in: <strong>English</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-xl">verified</span>
                <span>Credential Status: <strong>Cleared</strong></span>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              className="w-full py-4 bg-primary text-on-secondary rounded-xl font-bold shadow-md hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Book Session
              <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
            </button>
          </div>

        </div>

      </div>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-outline-variant/30 dark:border-slate-700 shadow-2xl relative"
            >
              
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Your Session</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Configure your appointment with the medical specialist below.
                </p>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                
                {/* Tutor Info Group */}
                <div className="p-4 bg-primary/5 dark:bg-slate-700/50 rounded-2xl flex items-center gap-3 border border-primary/10 dark:border-slate-600">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/10 bg-primary/10 flex items-center justify-center shrink-0">
                    {tutor.image ? (
                      <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-2xl">person</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{tutor.name}</h4>
                    <p className="text-xs text-primary dark:text-primary-fixed-dim font-bold">
                      ${tutor.price}/hr • {tutor.institution}
                    </p>
                  </div>
                </div>

                {/* Student Details (Read-only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Student Name</label>
                    <input
                      type="text"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-outline-variant/40 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-not-allowed outline-none"
                      value={user.displayName || 'Authenticated Student'}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Student Email</label>
                    <input
                      type="text"
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700/50 border border-outline-variant/40 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-not-allowed outline-none"
                      value={user.email}
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Topic / Subject Focus</label>
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {tutor.subjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Appointment Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Select Time Slot</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    >
                      <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                      <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Custom Student Note */}
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Study Focus / Notes</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Describe your learning objectives, exam timelines, or specific questions you have..."
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-xs font-bold transition-all"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-lg text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    <span className="material-symbols-outlined text-[14px]">done</span>
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
