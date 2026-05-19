import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tutors from './pages/Tutors';
import TutorDetails from './pages/TutorDetails';
import AddTutor from './pages/AddTutor';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

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
              <MyBookings />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Layout>
              <AdminDashboard />
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
