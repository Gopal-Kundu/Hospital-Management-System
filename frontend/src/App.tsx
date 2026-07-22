import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManagePatients from './pages/ManagePatients';
import ManageAppointments from './pages/ManageAppointments';

import LandingPage from './pages/LandingPage';
import VerifyOtp from './pages/VerifyOtp';

const AuthRedirect = ({ children }) => {
  const { user } = useSelector((state: any) => state.auth);
  
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard'} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
        <div className="flex-grow flex flex-col">
          <Navbar />
          
          <main className="flex-grow flex flex-col justify-center">
            <Routes>
              {/* Root */}
              <Route path="/" element={<LandingPage />} />

              {/* Public/Auth Routes */}
              <Route 
                path="/login" 
                element = {
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/register" 
                element = {
                  <AuthRedirect>
                    <Register />
                  </AuthRedirect>
                } 
              />
              <Route 
                path="/verify-otp" 
                element = {
                  <AuthRedirect>
                    <VerifyOtp />
                  </AuthRedirect>
                } 
              />

              {/* Patient Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/manage-doctors" element={<ManageDoctors />} />
                <Route path="/manage-patients" element={<ManagePatients />} />
                <Route path="/manage-appointments" element={<ManageAppointments />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <Footer />

        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'bg-white border border-slate-200 text-slate-800 rounded-2xl text-sm font-semibold shadow-lg',
            duration: 3000,
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }} 
        />
      </div>
    </Router>
  );
}

export default App;
