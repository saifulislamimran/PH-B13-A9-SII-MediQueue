import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/30 dark:border-white/10 ${
        isScrolled
          ? 'h-16 bg-surface/90 dark:bg-inverse-surface/90 shadow-md backdrop-blur-md'
          : 'h-20 bg-surface/70 dark:bg-inverse-surface/70 backdrop-blur-md'
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
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/tutors"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            Find Tutors
          </NavLink>
          <NavLink
            to="/add-tutor"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            Add Tutor
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim'
                  : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`
            }
          >
            My Bookings
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-container transition-colors dark:hover:bg-on-surface-variant/20"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Action buttons (Mock state for login/logout) */}
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

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface dark:bg-inverse-surface border-b border-outline-variant/30 p-6 flex flex-col gap-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface dark:text-inverse-on-surface font-semibold py-2 border-b border-outline-variant/10"
          >
            Home
          </Link>
          <Link
            to="/tutors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface dark:text-inverse-on-surface font-semibold py-2 border-b border-outline-variant/10"
          >
            Find Tutors
          </Link>
          <Link
            to="/add-tutor"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface dark:text-inverse-on-surface font-semibold py-2 border-b border-outline-variant/10"
          >
            Add Tutor
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-on-surface dark:text-inverse-on-surface font-semibold py-2 border-b border-outline-variant/10"
          >
            My Bookings
          </Link>
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
        </div>
      )}
    </header>
  );
}
