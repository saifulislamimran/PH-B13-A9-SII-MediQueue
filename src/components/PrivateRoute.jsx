import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If Firebase is still verifying the user state, show a premium loading indicator
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface-container-lowest">
        {/* Themed Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent animate-spin"></div>
        </div>
        <p className="font-semibold text-primary dark:text-primary-fixed-dim animate-pulse">
          Authenticating secure session...
        </p>
      </div>
    );
  }

  // If logged in, grant access to child content
  if (user) {
    // Check if the user role is authorized to view this page
    if (allowedRoles && !allowedRoles.includes(user.role || 'student')) {
      // Schedule warning toast briefly after render to avoid React scheduling warning
      setTimeout(() => {
        toast.error('Access Denied: You do not have permission to access this dashboard.');
      }, 50);
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // If not logged in, redirect to login page, saving the original location path
  return <Navigate to="/login" state={{ from: location }} replace />;
}
