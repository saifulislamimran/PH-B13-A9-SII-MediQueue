import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logoutUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown & Modal States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editRole, setEditRole] = useState('student');

  // Scroll event listener to shrink Navbar height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown click outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.profile-menu-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Successfully logged out!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log out.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name is required.');
      return;
    }
    try {
      await updateUserProfile(editName, editPhotoURL, editRole);
      toast.success('Profile updated successfully!');
      setIsEditProfileOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/30 dark:border-slate-800 ${
        isScrolled
          ? 'h-16 bg-white/95 dark:bg-slate-900/95 shadow-md backdrop-blur-md'
          : 'h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-3xl">school</span>
          <span className="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
            MediQueue
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 py-1 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/tutors"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 py-1 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            Find Tutors
          </NavLink>
          
          {user && (
            <>
              {/* Add Tutor link - Restricted to Tutors and Admins */}
              {(user.role === 'tutor' || user.role === 'admin') && (
                <NavLink
                  to="/add-tutor"
                  className={({ isActive }) =>
                    `font-semibold transition-colors duration-200 py-1 ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-fixed-dim'
                    }`
                  }
                >
                  Add Tutor
                </NavLink>
              )}

              {/* My Bookings link - Accessible to all roles */}
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `font-semibold transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-fixed-dim'
                  }`
                }
              >
                My Bookings
              </NavLink>

              {/* System Stats link - Restricted to Admins */}
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `font-semibold transition-colors duration-200 py-1 ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-fixed-dim'
                    }`
                  }
                >
                  System Stats
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Authentication States */}
          {user ? (
            <div className="hidden sm:flex items-center gap-4 relative">
              {/* Interactive Profile Dropdown Button */}
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-all duration-200 border border-outline-variant/20 dark:border-slate-700 active:scale-95"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                    {user.photoURL ? (
                      <img alt={user.displayName} className="w-full h-full object-cover" src={user.photoURL} />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-xl">person</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                    {user.displayName || 'User'}
                  </span>
                  <span className={`material-symbols-outlined text-sm transition-transform duration-200 text-gray-500 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-3 duration-250 z-50">
                    {/* User Summary Info */}
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-outline-variant/20 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/10 bg-primary/10 flex items-center justify-center shrink-0">
                        {user.photoURL ? (
                          <img alt={user.displayName} className="w-full h-full object-cover" src={user.photoURL} />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-lg">person</span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : user.role === 'tutor' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {user.role || 'Student'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setEditName(user.displayName || '');
                          setEditPhotoURL(user.photoURL || '');
                          setEditRole(user.role || 'student');
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-label-md text-label-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-lg">manage_accounts</span>
                        Edit Profile
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-label-md text-label-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 font-label-md text-label-md font-semibold text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary text-on-secondary rounded-full font-label-md text-label-md font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-outline-variant/30 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-700 dark:text-gray-200 font-semibold py-2 border-b border-outline-variant/10 dark:border-slate-800"
          >
            Home
          </Link>
          <Link
            to="/tutors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-700 dark:text-gray-200 font-semibold py-2 border-b border-outline-variant/10 dark:border-slate-800"
          >
            Find Tutors
          </Link>
          
          {user ? (
            <>
              {/* Add Tutor link - Restricted to Tutors and Admins */}
              {(user.role === 'tutor' || user.role === 'admin') && (
                <Link
                  to="/add-tutor"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 font-semibold py-2 border-b border-outline-variant/10 dark:border-slate-800"
                >
                  Add Tutor
                </Link>
              )}
              
              <Link
                to="/my-bookings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200 font-semibold py-2 border-b border-outline-variant/10 dark:border-slate-800"
              >
                My Bookings
              </Link>

              {/* System Stats link - Restricted to Admins */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 font-semibold py-2 border-b border-outline-variant/10 dark:border-slate-800"
                >
                  System Stats
                </Link>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {/* Mobile Profile Display with Edit Trigger */}
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/10 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                      {user.photoURL ? (
                        <img alt={user.displayName} className="w-full h-full object-cover" src={user.photoURL} />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-xl">person</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block truncate max-w-[150px]">
                        {user.displayName || 'User'}
                      </span>
                      <span className={`inline-block px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : user.role === 'tutor' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {user.role || 'Student'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setEditName(user.displayName || '');
                      setEditPhotoURL(user.photoURL || '');
                      setEditRole(user.role || 'student');
                      setIsEditProfileOpen(true);
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center border border-primary/20"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  Logout
                  <span className="material-symbols-outlined text-sm">logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-primary text-primary dark:border-primary-fixed-dim dark:text-primary-fixed-dim rounded-xl font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-primary text-on-secondary rounded-xl font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="edit-name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg dark:text-gray-400">
                    person
                  </span>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-950 dark:text-white placeholder:text-gray-400"
                    placeholder="Enter your name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="edit-photo">
                  Photo URL
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg dark:text-gray-400">
                    image
                  </span>
                  <input
                    id="edit-photo"
                    type="url"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-950 dark:text-white placeholder:text-gray-400"
                    placeholder="https://example.com/photo.jpg"
                    value={editPhotoURL}
                    onChange={(e) => setEditPhotoURL(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block" htmlFor="edit-role">
                  Account Type / Role
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg dark:text-gray-400">
                    badge
                  </span>
                  <select
                    id="edit-role"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm text-gray-950 dark:text-white appearance-none cursor-pointer"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="student">Student (General User)</option>
                    <option value="tutor">Tutor (Instructor)</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none dark:text-gray-400">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-secondary hover:opacity-95 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
