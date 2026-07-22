import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const configHeaders = {
        withCredentials: true
      };
      
      const statsRes = await axios.get(`${baseURL}/admin/stats`, configHeaders);
      const appointmentsRes = await axios.get(`${baseURL}/appointments`, configHeaders);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (appointmentsRes.data.success) {
        setRecentAppointments(appointmentsRes.data.appointments.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'Pending':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'Completed':
        return 'bg-slate-50 border-slate-200 text-slate-600';
      default:
        return 'bg-red-50 border-red-200 text-red-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-red-500" />
          Hospital Administration Portal
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor clinic stats, manage patient profiles, schedule doctor rosters, and process active appointments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Patients */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition duration-300 relative group overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
              <div className="flex items-center justify-between">
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-red-500">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stats?.totalPatients || 0}</span>
                <h3 className="text-sm font-semibold text-slate-400 mt-1">Total Patients</h3>
              </div>
            </div>

            {/* Total Doctors */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition duration-300 relative group overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
              <div className="flex items-center justify-between">
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-red-500">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stats?.totalDoctors || 0}</span>
                <h3 className="text-sm font-semibold text-slate-400 mt-1">Total Doctors</h3>
              </div>
            </div>

            {/* Total Appointments */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition duration-300 relative group overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
              <div className="flex items-center justify-between">
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-red-500">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stats?.totalAppointments || 0}</span>
                <h3 className="text-sm font-semibold text-slate-400 mt-1">Total Appointments</h3>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 transition duration-300 relative group overflow-hidden shadow-sm">
              <div className="flex items-center justify-between">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                {stats?.pendingAppointments > 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">Action Required</span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stats?.pendingAppointments || 0}</span>
                <h3 className="text-sm font-semibold text-slate-400 mt-1">Pending Requests</h3>
              </div>
            </div>

          </div>

          {/* Quick Management Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Manage Doctors Link */}
            <Link 
              to="/manage-doctors" 
              className="bg-white border border-slate-200 hover:border-red-500/50 rounded-3xl p-6 flex items-center justify-between group transition duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3.5 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 group-hover:text-red-600 transition">Manage Doctors</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Add roster, configure departments, days.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition duration-300" />
            </Link>

            {/* Manage Patients Link */}
            <Link 
              to="/manage-patients" 
              className="bg-white border border-slate-200 hover:border-red-500/50 rounded-3xl p-6 flex items-center justify-between group transition duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3.5 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 group-hover:text-red-600 transition">Manage Patients</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lookup profiles, view database, search.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition duration-300" />
            </Link>

            {/* Manage Appointments Link */}
            <Link 
              to="/manage-appointments" 
              className="bg-white border border-slate-200 hover:border-red-500/50 rounded-3xl p-6 flex items-center justify-between group transition duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3.5 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white transition duration-300">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 group-hover:text-red-600 transition">Manage Appointments</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Approve bookings, update care status.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition duration-300" />
            </Link>

          </div>

          {/* Recent Appointments Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Recent Appointment Inflow
              </h2>
              <Link 
                to="/manage-appointments" 
                className="text-xs text-red-600 hover:text-red-500 font-bold hover:underline flex items-center gap-0.5"
              >
                View all appointments
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                No appointment logs in system.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-655">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-3 pt-2">Patient</th>
                      <th className="pb-3 pt-2">Physician</th>
                      <th className="pb-3 pt-2 text-xs">Scheduled Date</th>
                      <th className="pb-3 pt-2 text-xs">Reason</th>
                      <th className="pb-3 pt-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAppointments.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="py-3.5 pr-2 font-bold text-slate-800">{app.patient ? app.patient.name : 'Unknown'}</td>
                        <td className="py-3.5 pr-2">
                          <div className="font-semibold text-slate-700">Dr. {app.doctor ? app.doctor.name : 'Unknown'}</div>
                          <div className="text-[10px] text-slate-400">{app.doctor ? app.doctor.department : 'General'}</div>
                        </td>
                        <td className="py-3.5 pr-2 text-xs text-slate-500">
                          {new Date(app.date).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="py-3.5 pr-2 text-xs text-slate-500 max-w-[200px] truncate" title={app.reason}>
                          {app.reason}
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
