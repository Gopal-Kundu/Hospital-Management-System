import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-6">
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <h1 className="text-3xl font-extrabold text-indigo-400 mb-3 tracking-tight">
          Hospital Management System
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Basic server and UI template configured with Vite, React, and Tailwind CSS v4.
        </p>
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Frontend Ready</span>
        </div>
      </div>
    </div>
  );
}

export default App;
