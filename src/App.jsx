import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tutors from './pages/Tutors';
import TutorDetails from './pages/TutorDetails';
import AddTutor from './pages/AddTutor';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import useDocumentTitle from './hooks/useDocumentTitle';

// Simple placeholders for pages to be built in subsequent phases
function MyBookingsPlaceholder() {
  useDocumentTitle('My Bookings');
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">My Bookings & Tutors</h1>
      <p className="text-on-surface-variant font-medium">My Bookings Page (Phase 13)</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/tutors"
        element={
          <Layout>
            <Tutors />
          </Layout>
        }
      />
      
      {/* Protected Routes */}
      <Route
        path="/tutor/:id"
        element={
          <PrivateRoute>
            <Layout>
              <TutorDetails />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/add-tutor"
        element={
          <PrivateRoute>
            <Layout>
              <AddTutor />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <Layout>
              <MyBookingsPlaceholder />
            </Layout>
          </PrivateRoute>
        }
      />
      
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      
      {/* Catch-all NotFound Page */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
