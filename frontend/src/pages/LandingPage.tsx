import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Activity, 
  ArrowRight, 
  Calendar, 
  Shield, 
  Users, 
  ChevronRight,
  Stethoscope
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="relative min-h-[calc(100vh-128px)] bg-slate-50 text-slate-800 overflow-hidden selection:bg-red-500 selection:text-white flex flex-col justify-center">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px]"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight text-slate-900">
          Modern Hospital Operations <br className="hidden md:inline" />
          <span className="text-red-600">Streamlined & Secure</span>
        </h1>

        <p className="text-slate-555 mt-6 text-base md:text-lg max-w-2xl leading-relaxed">
          Empowering patients with instant online appointment bookings and providing administrators with full roster controls, automated approvals, and diagnostic insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin-dashboard' : '/patient-dashboard'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition duration-300 shadow-lg shadow-red-600/20 hover:scale-[1.02]"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition duration-300 shadow-lg shadow-red-600/20 hover:scale-[1.02]"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold rounded-2xl transition duration-300 hover:scale-[1.02] shadow-sm"
              >
                Access Portal
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
