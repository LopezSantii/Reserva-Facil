import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LandingPage from '@/pages/LandingPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import OwnerDashboard from '@/pages/OwnerDashboard.jsx';
import ClientDashboard from '@/pages/ClientDashboard.jsx';
import SearchBusinesses from '@/pages/SearchBusinesses.jsx';
import BookingPage from '@/pages/BookingPage.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CreateBusinessPage from '@/pages/CreateBusinessPage.jsx';
import ManageSchedulePage from '@/pages/ManageSchedulePage.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const targetDashboard = user.role === 'owner' ? '/owner/dashboard' : '/client/dashboard';
    return <Navigate to={targetDashboard} />;
  }

  return children;
}

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const getHomeComponent = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
    }
    if (!user) {
      return <LandingPage />;
    }
    if (user.role && location.pathname === '/') {
      if (user.role === 'owner') {
        return <Navigate to="/owner/dashboard" />;
      }
      if (user.role === 'client') {
        return <Navigate to="/client/dashboard" />;
      }
    }
    return <LandingPage />;
  };

  return (
    <>
      <Helmet>
        <title>Reserva Fácil - Plataforma de Reservas Online</title>
        <meta name="description" content="Gestiona y reserva turnos de forma fácil y rápida. Plataforma completa para negocios y clientes." />
      </Helmet>
      <Routes>
        <Route path="/" element={getHomeComponent()} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/search" element={<SearchBusinesses />} />
        <Route 
          path="/booking/:businessId" 
          element={
            <ProtectedRoute allowedRoles={['client', 'owner']}>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/create-business"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <CreateBusinessPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/owner/manage-schedule/:businessId"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <ManageSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;