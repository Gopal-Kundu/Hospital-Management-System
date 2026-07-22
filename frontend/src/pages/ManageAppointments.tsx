import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { 
  ClipboardList, 
  User as UserIcon, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/appointments`, {
        withCredentials: true
      });
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/appointments/${id}/approve`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Appointment approved successfully');
        setAppointments((prev) => 
          prev.map((app) => app._id === id ? response.data.appointment : app)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve appointment');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await axios.put(`${baseURL}/appointments/${id}/complete`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Appointment marked as Completed');
        setAppointments((prev) => 
          prev.map((app) => app._id === id ? response.data.appointment : app)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete appointment');
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmCancel) return;

    try {
      const response = await axios.put(`${baseURL}/appointments/${id}/cancel`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        setAppointments((prev) => 
          prev.map((app) => app._id === id ? response.data.appointment : app)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 border border-emerald-200 text-emerald-600';
      case 'Pending':
        return 'bg-amber-50 border border-amber-200 text-amber-600';
      case 'Completed':
        return 'bg-slate-50 border border-slate-200 text-slate-600';
      default:
        return 'bg-red-50 border border-red-200 text-red-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title Header */}
      <div className="mb-8">
        <Link 
          to="/admin-dashboard" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-655 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-red-500" />
          Appointments Registry
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review appointment requests, assign status, and monitor clinician schedules.
        </p>
      </div>

      {/* Control filter bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <Filter className="w-4 h-4 text-slate-450" />
          Filter by Status:
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-4 py-2 rounded-xl border font-bold transition duration-300 ${
                statusFilter === status
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-600 text-base">No Appointments Found</h3>
          <p className="text-slate-400 text-xs mt-1">
            There are no appointments matching the status "{statusFilter}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div 
              key={app._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
            >
              {/* Left detail info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                
                {/* Patient details */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-red-550 text-sm font-bold shadow-sm flex-shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient</span>
                    <span className="text-sm font-extrabold text-slate-800">{app.patient ? app.patient.name : 'Unknown'}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[150px]" title={app.patient?.email}>{app.patient ? app.patient.email : ''}</span>
                  </div>
                </div>

                {/* Doctor details */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Physician</span>
                  <span className="text-sm font-extrabold text-slate-800 block">Dr. {app.doctor ? app.doctor.name : 'Unknown'}</span>
                  <span className="text-xs text-red-655 bg-red-50 px-2 py-0.5 border border-red-100 rounded-md font-semibold inline-block mt-0.5">{app.doctor ? app.doctor.department : 'General'}</span>
                </div>

                {/* Date & Reason */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Schedule</span>
                  <span className="text-xs text-slate-700 font-semibold block">
                    {new Date(app.date).toLocaleDateString(undefined, { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs text-slate-500 italic block mt-0.5 truncate max-w-[200px]" title={app.reason}>
                    " {app.reason} "
                  </span>
                </div>

              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {app.status}
                </span>

                <div className="flex items-center gap-2">
                  {app.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-50 border border-transparent hover:border-emerald-250 text-emerald-600 hover:text-emerald-700 text-xs font-bold rounded-xl transition duration-300"
                        title="Approve Booking"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(app._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 border border-transparent hover:border-red-250 text-red-500 hover:text-red-655 text-xs font-bold rounded-xl transition duration-300"
                        title="Cancel Booking"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  )}

                  {app.status === 'Approved' && (
                    <>
                      <button
                        onClick={() => handleComplete(app._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-550 text-white text-xs font-bold rounded-xl transition duration-300 shadow-sm"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancel(app._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 border border-transparent hover:border-red-250 text-red-500 hover:text-red-655 text-xs font-bold rounded-xl transition duration-300"
                        title="Cancel Booking"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageAppointments;
