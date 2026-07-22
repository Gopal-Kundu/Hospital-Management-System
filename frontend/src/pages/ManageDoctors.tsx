import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Stethoscope, 
  Calendar, 
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/doctors`, {
        withCredentials: true
      });
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast.error('Failed to load doctors roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenAddForm = () => {
    setEditingDoctorId(null);
    setName('');
    setDepartment('');
    setSelectedDays([]);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (doc) => {
    setEditingDoctorId(doc._id);
    setName(doc.name);
    setDepartment(doc.department);
    setSelectedDays(doc.availableDays);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDoctorId(null);
    setName('');
    setDepartment('');
    setSelectedDays([]);
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => 
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !department || selectedDays.length === 0) {
      toast.error('Please fill in name, department, and select at least one available day');
      return;
    }

    try {
      const configHeaders = {
        withCredentials: true
      };

      if (editingDoctorId) {
        // Edit Doctor
        const response = await axios.put(`${baseURL}/doctors/${editingDoctorId}`, {
          name,
          department,
          availableDays: selectedDays,
        }, configHeaders);

        if (response.data.success) {
          toast.success('Doctor updated successfully');
          setDoctors((prev) => prev.map((d) => d._id === editingDoctorId ? response.data.doctor : d));
        }
      } else {
        // Add Doctor
        const response = await axios.post(`${baseURL}/doctors`, {
          name,
          department,
          availableDays: selectedDays,
        }, configHeaders);

        if (response.data.success) {
          toast.success('Doctor added successfully');
          setDoctors((prev) => [...prev, response.data.doctor]);
        }
      }
      handleCloseForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save doctor details');
    }
  };

  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this doctor from the registry?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseURL}/doctors/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Doctor deleted successfully');
        setDoctors((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back & Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link 
            to="/admin-dashboard" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-650 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-red-500" />
            Physician Registry
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Add new consultants, adjust duty slots, and manage departments.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenAddForm}
            className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-550 text-white font-bold rounded-2xl transition duration-300 shadow-md hover:scale-[1.02] self-start sm:self-center"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </button>
        )}
      </div>

      {/* Main Layout: Doctor Form Modal/Box & Doctor List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Doctor Form Panel */}
        {isFormOpen && (
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 h-fit sticky top-28 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                {editingDoctorId ? 'Edit Doctor Details' : 'Add New Doctor'}
              </h2>
              <button 
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-655 p-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Doctor Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elizabeth Blackwell"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition duration-300"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Department / Specialty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology, Pediatrics"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition duration-300"
                />
              </div>

              {/* Available Days Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">Duty Availability Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition duration-200 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-red-50 border-red-200 text-red-600 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition duration-300 shadow-md"
                >
                  Save Doctor
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Doctors Roster List Grid */}
        <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600 text-base">No Doctors Registered</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Start building your healthcare team. Add your first consultant using the "Add Doctor" button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div 
                  key={doc._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 transition duration-300 flex flex-col justify-between gap-5 relative group shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-slate-800 group-hover:text-red-600 transition text-base">
                          Dr. {doc.name}
                        </h3>
                        <span className="inline-block text-[11px] text-red-655 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 mt-1">
                          {doc.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          onClick={() => handleOpenEditForm(doc)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-red-200 transition"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-red-200 transition"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Weekly Availability
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.availableDays.map((day) => (
                          <span 
                            key={day} 
                            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 font-medium px-2 py-0.5 rounded-md"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageDoctors;
