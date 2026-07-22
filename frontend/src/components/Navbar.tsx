import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { setHideRoleSelection } from '../redux/authSlice';
import { 
  Activity, 
  LogOut, 
  Calendar, 
  Users, 
  Stethoscope, 
  LayoutDashboard,
  ClipboardList,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
    ${isActive(path) 
      ? 'bg-red-600 text-white shadow-md shadow-red-600/10' 
      : 'text-slate-600 hover:text-red-600 hover:bg-red-50'}
  `;

  const mobileLinkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200
    ${isActive(path) 
      ? 'bg-red-600 text-white shadow-sm' 
      : 'text-slate-600 hover:text-red-600 hover:bg-red-50'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 border-b border-red-100 backdrop-blur-xl px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-red-100 p-2 rounded-xl border border-red-200 group-hover:border-red-400 transition-all duration-300">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 group-hover:animate-pulse" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-red-600 truncate max-w-[180px] sm:max-w-none">
            Hospital Management System
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            {user.role === 'admin' ? (
              <>
                <Link to="/admin-dashboard" className={linkClass('/admin-dashboard')}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/manage-doctors" className={linkClass('/manage-doctors')}>
                  <Stethoscope className="w-4 h-4" />
                  Doctors
                </Link>
                <Link to="/manage-patients" className={linkClass('/manage-patients')}>
                  <Users className="w-4 h-4" />
                  Patients
                </Link>
                <Link to="/manage-appointments" className={linkClass('/manage-appointments')}>
                  <ClipboardList className="w-4 h-4" />
                  Appointments
                </Link>
              </>
            ) : (
              <>
                <Link to="/patient-dashboard" className={linkClass('/patient-dashboard')}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/book-appointment" className={linkClass('/book-appointment')}>
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        )}

        {/* Desktop Right Panel / Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Desktop User profile & logout */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] font-semibold text-red-500 uppercase tracking-widest leading-none">
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-300"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-red-650 transition duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => dispatch(setHideRoleSelection(false))}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition duration-300 shadow-md shadow-red-600/10"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-100 hover:border-red-100 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            
            {/* User Profile Card for Mobile */}
            {user && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-red-500 to-red-600 flex items-center justify-center text-white font-extrabold text-base shadow">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-xs font-bold text-red-500 uppercase tracking-wider mt-0.5">
                    {user.role} Account
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            {user ? (
              user.role === 'admin' ? (
                <>
                  <Link 
                    to="/admin-dashboard" 
                    className={mobileLinkClass('/admin-dashboard')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/manage-doctors" 
                    className={mobileLinkClass('/manage-doctors')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Stethoscope className="w-5 h-5" />
                    Manage Doctors
                  </Link>
                  <Link 
                    to="/manage-patients" 
                    className={mobileLinkClass('/manage-patients')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    Manage Patients
                  </Link>
                  <Link 
                    to="/manage-appointments" 
                    className={mobileLinkClass('/manage-appointments')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ClipboardList className="w-5 h-5" />
                    Manage Appointments
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/patient-dashboard" 
                    className={mobileLinkClass('/patient-dashboard')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/book-appointment" 
                    className={mobileLinkClass('/book-appointment')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Link>
                </>
              )
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <Link
                  to="/login"
                  className="w-full py-3 text-center text-base font-bold text-slate-600 hover:text-red-650 bg-slate-50 border border-slate-200 rounded-xl transition duration-305"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3 text-center text-base font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition duration-305 shadow-md"
                  onClick={() => {
                    setIsMenuOpen(false);
                    dispatch(setHideRoleSelection(false));
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Logout for mobile */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 border border-dashed border-red-200 hover:border-red-300 rounded-xl text-base font-bold transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
