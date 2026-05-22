import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { mockTutors } from '../data/mockTutors';

export default function MyBookings() {
  useDocumentTitle('My Dashboard');
  const { user, updateUserProfile, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Dashboard Tabs: 'bookings', 'tutors', 'profile'
  const [activeTab, setActiveTab] = useState('bookings');

  // Booking & Tutor Data States
  const [bookings, setBookings] = useState([]);
  const [myTutors, setMyTutors] = useState([]);
  const [pendingTutorApp, setPendingTutorApp] = useState(null);

  // Profile Form States
  const [age, setAge] = useState('');
  const [designation, setDesignation] = useState('');
  const [institution, setInstitution] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Change Request Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqRole, setReqRole] = useState('student');
  const [reqId, setReqId] = useState('');

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

  // Tutor Application Modal States
  const [isTutorApplyOpen, setIsTutorApplyOpen] = useState(false);
  const [appSubject, setAppSubject] = useState('USMLE Step 1');
  const [appInstitution, setAppInstitution] = useState('');
  const [appPrice, setAppPrice] = useState(45);
  const [appBio, setAppBio] = useState('');
  const [appCredentials, setAppCredentials] = useState('');

  // Tutor Listing Edit States
  const [isEditListingOpen, setIsEditListingOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [listSubjects, setListSubjects] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listBio, setListBio] = useState('');
  const [listInstitution, setListInstitution] = useState('');

  // Parse tab parameter from URL on mount and whenever search parameters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [window.location.search]);

  // Load user profile details into states when user updates
  useEffect(() => {
    if (user) {
      setAge(user.age || '');
      setDesignation(user.designation || '');
      setInstitution(user.institution || '');
      setPhotoURL(user.photoURL || '');

      setReqName(user.displayName || '');
      setReqEmail(user.email || '');
      setReqRole(user.role || 'student');
      setReqId(user.studentTutorId || '');
    }
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;

    // Load bookings
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b) => b.studentEmail === user.email);
    setBookings(userBookings);

    // Load custom tutors listing matching email
    const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
    const userTutors = customTutors.filter((t) => t.email === user.email);
    setMyTutors(userTutors);

    // Load pending tutor applications for current user
    const apps = JSON.parse(localStorage.getItem('tutor_applications') || '[]');
    const userApp = apps.find(a => a.userEmail === user.email && a.status === 'pending');
    setPendingTutorApp(userApp || null);
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
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const updatedTutors = customTutors.map((t) => {
        if (t.id === reviewTutorId) {
          const newCount = (t.reviewsCount || 0) + 1;
          const newRating = parseFloat((((t.rating || 5.0) * (t.reviewsCount || 0) + rating) / newCount).toFixed(1));
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

  // Save Direct Editable Profile Info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const extra = {
        age: age ? Number(age) : '',
        designation,
        institution,
        subscriptionStatus: user.subscriptionStatus || 'free'
      };
      await updateUserProfile(user.displayName, photoURL || user.photoURL || '', user.role, extra);
      toast.success('Profile saved successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile settings.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Profile Change Request (Identity fields)
  const handleRequestChangeSubmit = (e) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim()) {
      toast.error('Name and Email are required.');
      return;
    }
    try {
      const requests = JSON.parse(localStorage.getItem('profile_change_requests') || '[]');
      const existing = requests.find(r => r.userEmail === user.email && r.status === 'pending');
      if (existing) {
        toast.error('You already have a pending change request under administrator review.');
        setIsRequestModalOpen(false);
        return;
      }

      const newReq = {
        id: 'req-' + Math.random().toString(36).substr(2, 9),
        userId: user.uid || 'mock-id',
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        oldValues: {
          displayName: user.displayName || '',
          email: user.email || '',
          role: user.role || 'student',
          studentTutorId: user.studentTutorId || ''
        },
        requestedChanges: {
          displayName: reqName,
          email: reqEmail,
          role: reqRole,
          studentTutorId: reqId
        },
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      requests.push(newReq);
      localStorage.setItem('profile_change_requests', JSON.stringify(requests));
      toast.success('Profile change request submitted to Administrator!');
      setIsRequestModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit change request.');
    }
  };

  // Submit Tutor Application
  const handleTutorApplySubmit = (e) => {
    e.preventDefault();
    if (!appInstitution.trim() || !appBio.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      const apps = JSON.parse(localStorage.getItem('tutor_applications') || '[]');
      const existing = apps.find(a => a.userEmail === user.email && a.status === 'pending');
      if (existing) {
        toast.error('You already have a pending tutor application.');
        setIsTutorApplyOpen(false);
        return;
      }

      const newApp = {
        id: 'app-' + Math.random().toString(36).substr(2, 9),
        userId: user.uid || 'mock-uid',
        userName: user.displayName || user.email.split('@')[0],
        userEmail: user.email,
        subjects: [appSubject],
        institution: appInstitution,
        price: Number(appPrice),
        bio: appBio,
        credentialsUrl: appCredentials || 'https://example.com/mock-degree.pdf',
        status: 'pending',
        appliedAt: new Date().toISOString()
      };

      apps.push(newApp);
      localStorage.setItem('tutor_applications', JSON.stringify(apps));
      toast.success('Tutor application submitted for review!');
      setIsTutorApplyOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit tutor application.');
    }
  };

  // Toggle Tutor Listing Availability
  const handleToggleTutorAvailability = (tutorId) => {
    try {
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const updated = customTutors.map(t => {
        if (t.id === tutorId) {
          const newAvailability = !t.available;
          toast.success(`Availability toggled to ${newAvailability ? 'Active' : 'Inactive'}`);
          return { ...t, available: newAvailability };
        }
        return t;
      });
      localStorage.setItem('customTutors', JSON.stringify(updated));
      loadData();
    } catch (err) {
      toast.error('Failed to toggle availability.');
    }
  };

  // Click Edit Tutor Listing
  const handleEditListingClick = (tutor) => {
    setEditingTutor(tutor);
    setListSubjects(tutor.subjects.join(', '));
    setListPrice(tutor.price);
    setListBio(tutor.description || tutor.bio || '');
    setListInstitution(tutor.institution);
    setIsEditListingOpen(true);
  };

  // Save Tutor Listing Details
  const handleSaveListingSubmit = (e) => {
    e.preventDefault();
    try {
      const customTutors = JSON.parse(localStorage.getItem('customTutors') || '[]');
      const updated = customTutors.map(t => {
        if (t.id === editingTutor.id) {
          return {
            ...t,
            subjects: listSubjects.split(',').map(s => s.trim()).filter(Boolean),
            price: Number(listPrice),
            description: listBio,
            institution: listInstitution
          };
        }
        return t;
      });
      localStorage.setItem('customTutors', JSON.stringify(updated));
      toast.success('Tutor card updated successfully!');
      setIsEditListingOpen(false);
      setEditingTutor(null);
      loadData();
    } catch (err) {
      toast.error('Failed to update listing details.');
    }
  };

  // Fast Toggle Premium Plan (Stripe Simulation)
  const handleFastToggleSubscription = async () => {
    try {
      const target = user.subscriptionStatus === 'premium' ? 'free' : 'premium';
      const extra = {
        age: user.age || '',
        designation: user.designation || '',
        institution: user.institution || '',
        subscriptionStatus: target
      };
      await updateUserProfile(user.displayName, user.photoURL || '', user.role, extra);
      toast.success(`Successfully switched to ${target.toUpperCase()} Plan!`);
      loadData();
    } catch (err) {
      toast.error('Failed to update plan status.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-surface-container-lowest dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant/30 dark:border-slate-700 shadow-xl max-w-sm">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-3 animate-pulse">lock</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">
            Please log in or register to view your personal MediQueue scheduling dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-5 py-2.5 bg-primary text-on-secondary rounded-xl font-bold text-xs">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 border border-primary text-primary rounded-xl font-bold text-xs">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPremium = user.subscriptionStatus === 'premium';

  return (
    <div className="min-h-screen py-12 px-6 bg-surface-container-lowest dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Dashboard Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12 border-b border-outline-variant/20 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 shadow-md">
                {user.photoURL ? (
                  <img alt={user.displayName} className="w-full h-full object-cover" src={user.photoURL} />
                ) : (
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                )}
              </div>
              <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white shadow-sm ${
                isPremium ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gray-400'
              }`} title={isPremium ? 'Premium Subscribed' : 'Free Tier Account'}>
                <span className="material-symbols-outlined text-[12px]">{isPremium ? 'stars' : 'info'}</span>
              </span>
            </div>
            <div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {user.displayName || user.email.split('@')[0]}
                </h1>
                {isPremium && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white tracking-wider flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{user.email}</p>
              <div className="flex gap-2 items-center mt-2 flex-wrap justify-center md:justify-start">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  ID: {user.studentTutorId || `MQ-${user.uid ? user.uid.substring(0, 6).toUpperCase() : 'NEW'}`}
                </span>
                <span className="text-gray-300 dark:text-slate-800">•</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Button Row */}
          <div className="flex gap-3 items-center">
            {/* Quick Upgrade Option */}
            <button
              onClick={handleFastToggleSubscription}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm border ${
                isPremium 
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900/30'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-white hover:opacity-90 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{isPremium ? 'remove_moderator' : 'workspace_premium'}</span>
              {isPremium ? 'Downgrade to Free' : 'Upgrade to Premium'}
            </button>

            {user.role === 'student' && !pendingTutorApp && (
              <button
                onClick={() => setIsTutorApplyOpen(true)}
                className="px-4 py-2.5 bg-primary text-on-secondary rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">school</span>
                Apply to Tutor
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-outline-variant/20 dark:border-slate-800 pb-4 mb-8 flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveTab('bookings');
              navigate('/my-bookings?tab=bookings');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-primary text-on-secondary'
                : 'text-gray-600 dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">event_upcoming</span>
            My Booked Sessions ({bookings.length})
          </button>
          
          {(user.role === 'tutor' || user.role === 'admin') && (
            <button
              onClick={() => {
                setActiveTab('tutors');
                navigate('/my-bookings?tab=tutors');
              }}
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

          <button
            onClick={() => {
              setActiveTab('profile');
              navigate('/my-bookings?tab=profile');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-primary text-on-secondary'
                : 'text-gray-600 dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            My Profile & settings
          </button>
        </div>

        {/* Tab Content Rendering */}
        
        {/* Tab 1: Bookings Content */}
        {activeTab === 'bookings' && (
          <div>
            {!isPremium ? (
              // Premium Upsell Block for Free Tier
              <div className="space-y-12">
                <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-xl border border-white/10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-[10px] font-extrabold uppercase rounded-full mb-6 tracking-wider">
                      PRO SUBSCRIPTION FEATURE
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
                      Manage and Reschedule Bookings Instantly
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
                      Upgrade to our premium tier to unlock full queue scheduling control. Easily reschedule with doctors, manage your booking lists, and get priority matching.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        <span className="text-xs font-semibold text-gray-200">Unlimited Rescheduling & Updates</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        <span className="text-xs font-semibold text-gray-200">Instant One-Click Cancellations</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        <span className="text-xs font-semibold text-gray-200">Direct Chat with Instructors</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        <span className="text-xs font-semibold text-gray-200">Ad-Free Dashboard & Priority Support</span>
                      </div>
                    </div>

                    <button
                      onClick={handleFastToggleSubscription}
                      className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-sm rounded-xl hover:opacity-95 transition-all shadow-md active:scale-98"
                    >
                      Subscribe to Pro
                    </button>
                  </div>
                </div>

                {/* Explore Featured Tutors Grid */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Explore Featured Tutors</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Unlock Premium to book custom dates with these high-rated experts.</p>
                    </div>
                    <Link to="/tutors" className="text-xs font-bold text-primary dark:text-primary-fixed-dim hover:underline">
                      View All Tutors
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockTutors.slice(0, 3).map((tutor) => (
                      <div key={tutor.id} className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={tutor.image} alt={tutor.name} className="w-11 h-11 rounded-full object-cover border border-primary/20" />
                            <div>
                              <h4 className="text-xs font-bold text-gray-950 dark:text-white">{tutor.name}</h4>
                              <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{tutor.institution}</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 italic mb-3">
                            "{tutor.description}"
                          </p>
                          <div className="flex gap-1.5 flex-wrap mb-4">
                            {tutor.subjects.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">${tutor.price}/hr</span>
                          <button
                            onClick={handleFastToggleSubscription}
                            className="px-3.5 py-1.5 bg-primary/10 text-primary dark:text-primary-fixed-dim text-[10px] font-extrabold rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            Book (Pro Only)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Premium View of Booked Sessions
              <div>
                {bookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        className="bg-white dark:bg-slate-850 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between relative hover:shadow-lg transition-shadow"
                      >
                        {/* Session details */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              {booking.tutorImage ? (
                                <img alt={booking.tutorName} className="w-full h-full object-cover" src={booking.tutorImage} />
                              ) : (
                                <span className="material-symbols-outlined text-primary text-2xl">person</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{booking.tutorName}</h3>
                              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">
                                {booking.tutorInstitution}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl space-y-2.5 mb-4 border border-gray-100 dark:border-slate-800">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-gray-500">Subject:</span>
                              <span className="px-2.5 py-0.5 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded font-bold text-[9px] uppercase tracking-wider">
                                {booking.subject}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-gray-500">Scheduled Date:</span>
                              <span className="text-gray-900 dark:text-gray-100 font-bold">{booking.appointmentDate}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-gray-500">Time Slot:</span>
                              <span className="text-gray-900 dark:text-gray-100 font-bold">{booking.appointmentTime}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-gray-500">Booking Status:</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                                booking.status === 'Rescheduled'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          {booking.note && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 italic mb-4">
                              Note: "{booking.note}"
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 justify-end border-t border-outline-variant/10 dark:border-slate-800 pt-4 mt-2">
                          <button
                            onClick={() => openReviewModal(booking.tutorId, booking.tutorName)}
                            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-outline-variant/10"
                          >
                            <span className="material-symbols-outlined text-[16px]">rate_review</span>
                            Review
                          </button>
                          <button
                            onClick={() => openRescheduleModal(booking)}
                            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 dark:text-amber-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.bookingId, booking.tutorName)}
                            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
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
                    <span className="material-symbols-outlined text-outline text-5xl mb-3 text-gray-400">calendar_today</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Active Bookings</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
                      You are subscribed to Premium Pro but have not booked any live tutorial queues yet.
                    </p>
                    <Link to="/tutors" className="px-5 py-2.5 bg-primary text-on-secondary rounded-xl font-bold text-xs inline-block">
                      Find Tutors
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Tutor Listings Content */}
        {activeTab === 'tutors' && (user.role === 'tutor' || user.role === 'admin') && (
          <div>
            {myTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="bg-white dark:bg-slate-850 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Premium Tutor Card Layout */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tutor.image || user.photoURL}
                            alt={tutor.name}
                            className="w-14 h-14 rounded-full object-cover border border-primary/20 shadow-sm"
                          />
                          <div>
                            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{tutor.name}</h3>
                            <p className="text-xs text-gray-500 font-bold mb-1">{tutor.institution}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-amber-500 text-sm fill-amber-500">star</span>
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{tutor.rating || 5.0}</span>
                              <span className="text-xs text-gray-400">({tutor.reviewsCount || 0} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Availability switch */}
                        <div className="flex flex-col items-end">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-1 tracking-wider ${
                            tutor.available 
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                          }`}>
                            {tutor.available ? 'Active Listing' : 'Paused Listing'}
                          </span>
                          <button
                            onClick={() => handleToggleTutorAvailability(tutor.id)}
                            className="p-1 hover:bg-gray-150 dark:hover:bg-slate-800 rounded-lg flex items-center border border-gray-200 dark:border-slate-700"
                            title="Toggle Tutor Availability"
                          >
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${
                              tutor.available ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {tutor.available ? 'toggle_on' : 'toggle_off'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Bio Details */}
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {tutor.description || tutor.bio || 'No tutor description provided.'}
                      </p>

                      {/* Subjects tags */}
                      <div className="flex gap-1.5 flex-wrap mb-6">
                        {tutor.subjects.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-lg text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/10 dark:border-slate-800 pt-4 mt-2">
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                        Rate: <span className="text-primary text-base">${tutor.price}</span>/hour
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditListingClick(tutor)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold transition-all border border-outline-variant/10 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit Details
                        </button>
                        <Link
                          to={`/tutor/${tutor.id}`}
                          className="px-4 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          View Live
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-outline-variant/30 dark:border-slate-700 max-w-sm mx-auto p-6 shadow-sm">
                <span className="material-symbols-outlined text-outline text-5xl mb-3 text-gray-400">medical_services</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Listing Cards Available</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs">
                  Your tutor application has been approved by the Admin, but you haven't published your tutor listings card yet.
                </p>
                <Link to="/add-tutor" className="px-5 py-2.5 bg-primary text-on-secondary rounded-xl font-bold text-xs inline-block">
                  Create Listing Card
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Profile & Settings Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form settings column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Editable Fields Form */}
              <div className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_edit</span>
                  Editable Profile Settings
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Age Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="prof-age">
                        Age
                      </label>
                      <input
                        id="prof-age"
                        type="number"
                        min="1"
                        max="120"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-900 dark:text-white"
                        placeholder="e.g. 24"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>

                    {/* Designation Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="prof-des">
                        Designation
                      </label>
                      <input
                        id="prof-des"
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-900 dark:text-white"
                        placeholder="e.g. Medical Student, Resident"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                      />
                    </div>

                  </div>

                  {/* Institution Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="prof-inst">
                      Institution / School
                    </label>
                    <input
                      id="prof-inst"
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-900 dark:text-white"
                      placeholder="e.g. Harvard Medical School"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                  </div>

                  {/* Photo URL Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="prof-photo">
                      Photo URL
                    </label>
                    <input
                      id="prof-photo"
                      type="url"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-900 dark:text-white"
                      placeholder="https://example.com/photo.jpg"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-3 bg-primary text-on-secondary rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">save</span>
                      )}
                      Save Profile Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Student-to-Tutor Applications Banner or Section */}
              {user.role === 'student' && (
                <div className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  {pendingTutorApp ? (
                    // Tutor Application is Pending Review
                    <div className="border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl p-5">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-amber-500 text-2xl">pending_actions</span>
                        <div>
                          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Tutor Application Pending Review</h4>
                          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                            You submitted an application on {new Date(pendingTutorApp.appliedAt).toLocaleDateString()} to tutor <strong>{pendingTutorApp.subjects[0]}</strong> at <strong>${pendingTutorApp.price}/hr</strong>. Our administrative team is currently conducting academic credential validation checks.
                          </p>
                          <div className="mt-4 flex gap-4 text-xs font-semibold text-amber-900 dark:text-amber-400 border-t border-amber-200/50 dark:border-amber-900/20 pt-3">
                            <span>Status: Pending</span>
                            <span>Institution: {pendingTutorApp.institution}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Call to action to become tutor
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">Become a Certified Tutor</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                          Share your medical clinical insight with peers globally. Earn money teaching USMLE, MCAT, or clinical clerkships on your own schedule.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAppInstitution(user.institution || '');
                          setIsTutorApplyOpen(true);
                        }}
                        className="px-5 py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        Apply to Tutor
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Locked Identity fields column */}
            <div className="space-y-6">
              
              {/* Locked Identity Fields Card */}
              <div className="bg-gray-50 dark:bg-slate-900/60 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-500 text-lg">lock</span>
                    Locked Identity fields
                  </h3>
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="text-xs font-bold text-primary dark:text-primary-fixed-dim hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">edit_square</span>
                    Request Change
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Lock 1: Name */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Full Name</span>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {user.displayName || user.email.split('@')[0]}
                      </span>
                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    </div>
                  </div>

                  {/* Lock 2: Email */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Email Address</span>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{user.email}</span>
                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    </div>
                  </div>

                  {/* Lock 3: Role */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">Account Role</span>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-bold uppercase text-primary dark:text-primary-fixed-dim">{user.role}</span>
                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    </div>
                  </div>

                  {/* Lock 4: Student/Tutor ID */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">System ID</span>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700">
                      <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-300">
                        {user.studentTutorId || 'MQ-PENDING'}
                      </span>
                      <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                  Name, Email, Role, and ID are secure variables managed by RBAC permissions. Any edits require Administrator change authorization review.
                </p>
              </div>

              {/* Mini Subscription Status Widget */}
              <div className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-2">Subscription plan</span>
                <div className={`p-4 rounded-2xl mb-4 border ${
                  isPremium 
                    ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200 text-amber-800 dark:border-amber-900/30 dark:text-amber-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-lg">{isPremium ? 'verified' : 'info'}</span>
                    <span className="text-sm font-extrabold">{isPremium ? 'PRO PREMIUM TIER' : 'FREE ACCOUNT TIER'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {isPremium 
                      ? 'You have full access to queue scheduling, rescheduling bookings, and direct tutor feedback.'
                      : 'You are on our basic free account. You can browse tutors but need Pro to manage bookings.'
                    }
                  </p>
                </div>

                <button
                  onClick={handleFastToggleSubscription}
                  className="w-full text-center py-2.5 border-2 border-dashed border-outline-variant hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-xl transition-all"
                >
                  {isPremium ? 'Simulate Cancel Subscription' : 'Simulate Upgrade ($19/mo)'}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* -------------------- MODALS PANEL -------------------- */}

      {/* Profile Change Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">edit_square</span>
                Request Profile Update
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Proposed edits will be sent as a diff to the approval queue for Administrative review.
              </p>

              <form onSubmit={handleRequestChangeSubmit} className="space-y-4">
                {/* Proposed Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="req-name-in">Proposed Display Name</label>
                  <input
                    id="req-name-in"
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                  />
                </div>

                {/* Proposed Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="req-email-in">Proposed Email Address</label>
                  <input
                    id="req-email-in"
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                  />
                </div>

                {/* Proposed Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="req-role-in">Requested User Role</label>
                  <select
                    id="req-role-in"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white cursor-pointer"
                    value={reqRole}
                    onChange={(e) => setReqRole(e.target.value)}
                  >
                    <option value="student">Student (General User)</option>
                    <option value="tutor">Tutor (Instructor)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Proposed ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="req-id-in">Proposed Student/Tutor ID</label>
                  <input
                    id="req-id-in"
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    placeholder="MQ-XXXXXX"
                    value={reqId}
                    onChange={(e) => setReqId(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutor Application Modal */}
      <AnimatePresence>
        {isTutorApplyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-[450px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsTutorApplyOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="text-lg font-bold text-gray-905 dark:text-white mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">school</span>
                Apply to Tutor
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Register as a certified medical tutor. Credentials will undergo verification check processes.
              </p>

              <form onSubmit={handleTutorApplySubmit} className="space-y-4">
                {/* Subject Expertise Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="app-sub-in">Expertise Subject</label>
                  <select
                    id="app-sub-in"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white cursor-pointer"
                    value={appSubject}
                    onChange={(e) => setAppSubject(e.target.value)}
                  >
                    <option value="USMLE Step 1">USMLE Step 1</option>
                    <option value="USMLE Step 2 CK">USMLE Step 2 CK</option>
                    <option value="MCAT Biology & Biochemistry">MCAT Biology & Biochemistry</option>
                    <option value="Medical Anatomy & Histology">Medical Anatomy & Histology</option>
                    <option value="Pathology & Pathophysiology">Pathology & Pathophysiology</option>
                    <option value="Clinical Pharmacology">Clinical Pharmacology</option>
                  </select>
                </div>

                {/* Institution */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="app-inst-in">Medical School / Institution</label>
                  <input
                    id="app-inst-in"
                    type="text"
                    required
                    placeholder="e.g. Johns Hopkins School of Medicine"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={appInstitution}
                    onChange={(e) => setAppInstitution(e.target.value)}
                  />
                </div>

                {/* Price / Hour */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="app-price-in">Price Rate per hour ($)</label>
                  <input
                    id="app-price-in"
                    type="number"
                    min="10"
                    max="300"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={appPrice}
                    onChange={(e) => setAppPrice(e.target.value)}
                  />
                </div>

                {/* Short Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="app-bio-in">Short Professional Bio</label>
                  <textarea
                    id="app-bio-in"
                    rows="2.5"
                    required
                    placeholder="Introduce yourself, list teaching experience and accomplishments..."
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={appBio}
                    onChange={(e) => setAppBio(e.target.value)}
                  ></textarea>
                </div>

                {/* Credentials file URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="app-cred-in">Degree/Enrollment Document URL</label>
                  <input
                    id="app-cred-in"
                    type="url"
                    placeholder="https://example.com/degree.pdf"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={appCredentials}
                    onChange={(e) => setAppCredentials(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTutorApplyOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold shadow-sm animate-pulse-slow"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {isRescheduleOpen && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 border border-outline-variant/30 dark:border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRescheduleOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
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
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">New Time Slot</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary cursor-pointer"
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
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 transition-all"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 border border-outline-variant/30 dark:border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={() => setIsReviewOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
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
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-650 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-750 dark:hover:bg-slate-650 text-gray-900 dark:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-90 transition-all"
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

      {/* Edit Tutor Card Listing Modal */}
      <AnimatePresence>
        {isEditListingOpen && editingTutor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsEditListingOpen(false);
                  setEditingTutor(null);
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Edit Listing Card Details
              </h3>
              <p className="text-xs text-gray-505 dark:text-gray-400 mb-6">
                Change pricing rates, expertise domains, bio details, or affiliation.
              </p>

              <form onSubmit={handleSaveListingSubmit} className="space-y-4">
                {/* Subjects (comma separated) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="list-sub-in">Expertise Subjects (comma-separated)</label>
                  <input
                    id="list-sub-in"
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={listSubjects}
                    onChange={(e) => setListSubjects(e.target.value)}
                  />
                </div>

                {/* Price Rate */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="list-price-in">Hourly Price Rate ($)</label>
                  <input
                    id="list-price-in"
                    type="number"
                    required
                    min="10"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                  />
                </div>

                {/* Bio Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="list-bio-in">Listing Description</label>
                  <textarea
                    id="list-bio-in"
                    rows="3.5"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={listBio}
                    onChange={(e) => setListBio(e.target.value)}
                  ></textarea>
                </div>

                {/* Institution */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="list-inst-in">Institution</label>
                  <input
                    id="list-inst-in"
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary"
                    value={listInstitution}
                    onChange={(e) => setListInstitution(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditListingOpen(false);
                      setEditingTutor(null);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-on-secondary rounded-xl text-xs font-bold"
                  >
                    Save Listing
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
