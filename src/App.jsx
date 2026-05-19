import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import useDocumentTitle from './hooks/useDocumentTitle';

// Simple placeholders for pages to be built in subsequent phases
function TutorsPlaceholder() {
  useDocumentTitle('Tutors Catalog');
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Explore Tutors</h1>
      <p className="text-on-surface-variant font-medium">Tutors Page (Phase 9)</p>
    </div>
  );
}

function AddTutorPlaceholder() {
  useDocumentTitle('Add Tutor');
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Add a Medical Tutor</h1>
      <p className="text-on-surface-variant font-medium">Add Tutor Page (Phase 12)</p>
    </div>
  );
}

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
            <TutorsPlaceholder />
          </Layout>
        }
      />
      <Route
        path="/add-tutor"
        element={
          <Layout>
            <AddTutorPlaceholder />
          </Layout>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <Layout>
            <MyBookingsPlaceholder />
          </Layout>
        }
      />
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
