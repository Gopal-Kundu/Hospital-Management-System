import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import { Calendar, Stethoscope, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctors`, {
          withCredentials: true
        });
        if (response.data.success) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        toast.error('Failed to load doctors list');
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const selectedDoctor = doctors.find((doc) => doc._id === selectedDoctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !date || !reason) {
      toast.error('Please complete all fields');
      return;
    }

    if (selectedDoctor) {
      const selectedDate = new Date(date);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDayName = daysOfWeek[selectedDate.getDay()];
      
      const isAvailable = selectedDoctor.availableDays.some(
        (day) => day.toLowerCase() === selectedDayName.toLowerCase()
      );
      
      if (!isAvailable) {
        const confirmAnyway = window.confirm(
          `Note: Dr. ${selectedDoctor.name} is normally available on [${selectedDoctor.availableDays.join(', ')}]. You selected a ${selectedDayName}. Do you still want to request this date?`
        );
        if (!confirmAnyway) return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/appointments`, {
        doctorId: selectedDoctorId,
        date,
        reason
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Appointment requested successfully!');
        navigate('/patient-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link 
        to="/patient-dashboard" 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-650 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Book a Medical Appointment</h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose your specialist physician, select a date, and describe the reason for your visit.
          </p>
        </div>

        {fetchingDoctors ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-slate-500 text-xs">Loading available doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-600">No Doctors Registered</h3>
            <p className="text-slate-400 text-xs mt-1">
              There are currently no doctors available in our hospital registry. Please contact administration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Physician Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Select Physician</label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <select
                  required
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300 appearance-none"
                >
                  <option value="" disabled className="text-slate-400">Choose a doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} — {doc.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Info Card */}
            {selectedDoctor && (
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                <h4 className="text-xs font-bold text-red-650 uppercase tracking-widest">Doctor Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2.5">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Department</span>
                    <span className="text-sm font-semibold text-slate-700">{selectedDoctor.department}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Regular Available Days</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedDoctor.availableDays.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Date Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300"
                />
              </div>
            </div>

            {/* Reason Text */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Reason for Visit</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms, medical concerns, or target care..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-550 text-white font-bold rounded-2xl transition duration-300 shadow-md shadow-red-600/10 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                'Submit Appointment Request'
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
