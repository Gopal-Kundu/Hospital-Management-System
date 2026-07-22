import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { 
  Users, 
  Search, 
  Trash2, 
  Mail, 
  Calendar, 
  ArrowLeft,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManagePatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/admin/patients${query ? `?search=${query}` : ''}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setPatients(response.data.patients);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.error('Failed to load patients list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDeletePatient = async (id) => {
    const confirmDelete = window.confirm(
      'Warning: Deleting this patient account will permanently delete the profile AND all scheduled/past appointments. Do you wish to continue?'
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseURL}/admin/patients/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Patient deleted');
        setPatients((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete patient');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Title & Nav Header */}
      <div className="mb-8">
        <Link 
          to="/admin-dashboard" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-650 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-red-500" />
          Patient Details
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Search patient registers, view details, and manage portal accounts.
        </p>
      </div>

      {/* Control bar: Search Input */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition duration-300"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="text-xs text-slate-500 font-semibold sm:ml-auto">
          Showing {patients.length} Registered Patients
        </div>
      </div>

      {/* Patients Display list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-600 text-base">No Patients Found</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
            {search ? 'Try adjusting your search criteria.' : 'There are no patient profiles registered in the system.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((pat) => (
            <div 
              key={pat._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 transition duration-300 flex flex-col justify-between gap-5 relative group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center text-white text-base font-bold shadow-md">
                    {pat.name ? pat.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 group-hover:text-red-600 transition text-sm">
                      {pat.name}
                    </h3>
                    <div className="text-[10px] bg-red-50 border border-red-100 text-red-655 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      PATIENT
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate" title={pat.email}>{pat.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Joined: {new Date(pat.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => handleDeletePatient(pat._id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 border border-transparent hover:border-red-100 text-red-500 hover:text-red-600 text-xs font-bold rounded-xl transition duration-300"
                  title="Remove Account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Patient
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManagePatients;
