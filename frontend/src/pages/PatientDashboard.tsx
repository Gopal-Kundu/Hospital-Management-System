import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseURL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PlusCircle, 
  History,
  ChevronRight
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { updateProfilePicture } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPic, setUploadingPic] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseURL}/appointments`, {
          withCredentials: true
        });
        if (response.data.success) {
          setAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const response = await axios.put(`${baseURL}/appointments/cancel/${id}`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        setAppointments((prev) => 
          prev.map((app) => (app._id === id ? { ...app, status: 'Cancelled' } : app))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPic(true);
    const toastId = toast.loading('Uploading profile picture...');
    try {
      const result = await updateProfilePicture(file);
      if (result.success) {
        toast.success('Profile picture updated successfully!', { id: toastId });
      } else {
        toast.error(result.error || 'Failed to upload picture', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to upload picture', { id: toastId });
    } finally {
      setUploadingPic(false);
    }
  };

  const upcomingAppointments = appointments.filter((app) => 
    app.status === 'Pending' || app.status === 'Approved'
  );

  const pastAppointments = appointments.filter((app) => 
    app.status === 'Completed' || app.status === 'Cancelled'
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'Pending':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'Completed':
        return 'bg-slate-100 border-slate-200 text-slate-600';
      default:
        return 'bg-red-50 border-red-250 text-red-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4 animate-pulse" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 border border-red-500 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-red-50 mt-2 max-w-xl">
              Welcome to your Hospital Management System dashboard. View your scheduled visits, access medical logs, and request new physician visits.
            </p>
          </div>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-red-600 font-bold rounded-2xl transition duration-300 shadow-md self-start md:self-auto hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5" />
            Book New Appointment
          </Link>
        </div>
      </div>

      {/* Main Grid: Profile info & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Information */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-fit shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-red-500" />
            Patient Profile
          </h2>
          <div className="flex flex-col items-center pb-6 border-b border-slate-100">
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-md">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : 'P'
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer text-center px-1"
              >
                {uploadingPic ? 'Uploading...' : 'Change Photo'}
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
                disabled={uploadingPic}
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{user?.name}</h3>
            <span className="text-xs bg-red-50 text-red-650 font-semibold px-3 py-1 border border-red-100 rounded-full mt-1.5 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Email Address</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">{user?.email}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Account Status</div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Patient Account
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Appointments lists */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointments */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Upcoming Visits
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-600">No upcoming appointments</h3>
                <p className="text-slate-400 text-xs mt-1">Book an appointment to see details here</p>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-500 font-bold mt-4 underline"
                >
                  Book appointment now
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((app) => (
                  <div 
                    key={app._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl hover:border-slate-200 transition duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          Dr. {app.doctor ? app.doctor.name : 'Unknown Doctor'}
                        </span>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="text-xs text-red-655 bg-red-50 px-2 py-0.5 border border-red-100 rounded-md font-medium">
                          {app.doctor ? app.doctor.department : 'General'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-555 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(app.date).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-slate-500 italic">
                        " {app.reason} "
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>

                      {app.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelAppointment(app._id)}
                          className="px-3 py-1.5 hover:bg-red-550/10 border border-transparent hover:border-red-200 text-red-500 hover:text-red-655 text-xs font-bold rounded-xl transition duration-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-red-500" />
              Previous Visits
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pastAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No past visit records found.
              </div>
            ) : (
              <div className="space-y-3">
                {pastAppointments.map((app) => (
                  <div 
                    key={app._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl opacity-75 hover:opacity-100 transition duration-300"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">
                          Dr. {app.doctor ? app.doctor.name : 'Unknown Doctor'}
                        </span>
                        <span className="text-xs text-slate-400">({app.doctor ? app.doctor.department : 'General'})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {new Date(app.date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
